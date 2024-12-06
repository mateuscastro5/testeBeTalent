'use strict'

const { execSync } = require('child_process')
const mysql = require('mysql2/promise')
const fs = require('fs')
const path = require('path')

function checkDockerRunning() {
  try {
    execSync('docker info', { stdio: 'ignore' })
    return true
  } catch (error) {
    return false
  }
}

function checkPortAvailable(port) {
  try {
    execSync(`netstat -ano | findstr :${port}`, { stdio: 'ignore' })
    return false
  } catch (error) {
    return true
  }
}

function cleanup() {
  try {
    execSync('docker compose down -v', { stdio: 'ignore' })
  } catch (error) {
    console.log('⚠️ Falha ao limpar containers')
  }
}

function ensureDockerComposeFile() {
  const composePath = path.join(__dirname, 'docker-compose.yml')
  const initScriptPath = path.join(__dirname, 'mysql-init.sql')
  const port = checkPortAvailable(3306) ? 3306 : 3307

  // Create initialization script with proper permissions
  const initScript = `
CREATE DATABASE IF NOT EXISTS betalent;
ALTER USER 'root'@'%' IDENTIFIED WITH mysql_native_password BY 'betalent123';
CREATE USER IF NOT EXISTS 'root'@'localhost' IDENTIFIED BY 'betalent123';
CREATE USER IF NOT EXISTS 'root'@'172.18.0.1' IDENTIFIED BY 'betalent123';
CREATE USER IF NOT EXISTS 'root'@'172.18.0.2' IDENTIFIED BY 'betalent123';
GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'172.18.0.1' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'172.18.0.2' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
`
  fs.writeFileSync(initScriptPath, initScript)

  const dockerCompose = `
services:
  mysql:
    image: mysql:8.0
    container_name: betalent_mysql
    environment:
      MYSQL_ROOT_PASSWORD: betalent123
      MYSQL_DATABASE: betalent
      MYSQL_ROOT_HOST: '%'
    ports:
      - "${port}:3306"
    volumes:
      - ./mysql-init.sql:/docker-entrypoint-initdb.d/init.sql
    command: >
      --default-authentication-plugin=mysql_native_password
      --bind-address=0.0.0.0
      --skip-host-cache
      --skip-name-resolve
    healthcheck:
      test: ["CMD", "mysqladmin", "ping", "-h", "localhost", "-pbetalent123"]
      interval: 5s
      timeout: 5s
      retries: 10
    restart: unless-stopped
`
  fs.writeFileSync(composePath, dockerCompose)
  return port
}

async function waitForMySQL(port, retries = 60, interval = 2000) {
  console.log('⌛ Aguardando MySQL iniciar...')
  
  for (let i = 0; i < retries; i++) {
    try {
      const connection = await mysql.createConnection({
        host: 'localhost',
        port: port,
        user: 'root',
        password: 'betalent123'
      })
      await connection.query('SELECT 1')
      await connection.end()
      console.log('\n✅ MySQL está pronto!')
      return true
    } catch (error) {
      process.stdout.write('.')
      await new Promise(resolve => setTimeout(resolve, interval))
    }
  }
  throw new Error('MySQL não iniciou no tempo esperado')
}

function checkDockerRequirements() {
  console.log('🔍 Verificando requisitos...')

  try {
    execSync('docker --version', { stdio: 'ignore' })
  } catch (error) {
    console.error('❌ Docker não está instalado!')
    console.log('\nPor favor, instale o Docker:')
    console.log('1. Visite: https://docs.docker.com/desktop/install/windows-install/')
    console.log('2. Baixe e instale o Docker Desktop')
    console.log('3. Reinicie seu computador')
    console.log('4. Execute este setup novamente')
    process.exit(1)
  }

  if (!checkDockerRunning()) {
    console.error('❌ Docker não está em execução!')
    console.log('\nPor favor:')
    console.log('1. Abra o Docker Desktop')
    console.log('2. Aguarde o Docker iniciar (ícone verde)')
    console.log('3. Execute este setup novamente')
    process.exit(1)
  }
}

async function setup() {
  console.log('🚀 Iniciando setup BeTalent API...')

  try {
    checkDockerRequirements()

    console.log('🐳 Configurando Docker...')
    const mysqlPort = ensureDockerComposeFile()
    console.log(`📝 Usando porta MySQL: ${mysqlPort}`)

    console.log('🧹 Limpando ambiente anterior...')
    cleanup()

    console.log('🐳 Iniciando containers Docker...')
    execSync('docker compose up -d', { stdio: 'inherit' })

    await waitForMySQL(mysqlPort)

    console.log('⚙️ Configurando ambiente...')
    if (!fs.existsSync('.env')) {
      fs.copyFileSync('.env.example', '.env')
    }

    console.log('📝 Atualizando configurações...')
    let envContent = fs.readFileSync('.env', 'utf8')
    envContent = envContent
      .replace('DB_CONNECTION=sqlite', 'DB_CONNECTION=mysql')
      .replace('DB_HOST=127.0.0.1', 'DB_HOST=127.0.0.1')
      .replace('DB_PORT=3306', `DB_PORT=${mysqlPort}`)
      .replace(/DB_PASSWORD=.*/, 'DB_PASSWORD=betalent123')
      .replace('DB_DATABASE=adonis', 'DB_DATABASE=betalent')
    fs.writeFileSync('.env', envContent)

    console.log('🔑 Gerando chave da aplicação...')
    execSync('adonis key:generate', { stdio: 'inherit' })

    console.log('🔄 Rodando migrations...')
    execSync('adonis migration:run', { stdio: 'inherit' })
    
    console.log('\n✨ Setup completo com sucesso!')
    console.log('\nPara iniciar o servidor, execute:')
    console.log('npm run dev')

  } catch (error) {
    console.error('❌ Setup falhou:', error.message)
    cleanup()
    process.exit(1)
  }
}

setup()