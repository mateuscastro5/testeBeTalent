// setup.js
'use strict'

const { execSync, spawnSync } = require('child_process')
const mysql = require('mysql2/promise')
const fs = require('fs')

function checkDockerRequirements() {
  console.log('🔍 Verificando requisitos...')

  // Check Docker
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

  // Check Docker Compose
  try {
    // Try modern Docker Compose command
    execSync('docker compose version', { stdio: 'ignore' })
  } catch (error) {
    try {
      // Try legacy docker-compose command
      execSync('docker-compose --version', { stdio: 'ignore' })
    } catch (error) {
      console.error('❌ Docker Compose não está instalado!')
      console.log('\nPor favor, instale o Docker Desktop que já inclui o Docker Compose')
      process.exit(1)
    }
  }
}

async function setup() {
  console.log('🚀 Iniciando setup BeTalent API...')

  try {
    // Check requirements first
    checkDockerRequirements()

    console.log('🐳 Iniciando containers Docker...')
    // Use modern Docker Compose syntax
    execSync('docker compose up -d', { stdio: 'inherit' })

    // Rest of your setup code...
    await waitForMySQL()
    // ...

  } catch (error) {
    console.error('❌ Setup falhou:', error.message)
    process.exit(1)
  }
}

setup()