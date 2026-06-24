#!/bin/bash

# LexCare AI DigitalOcean Deployment Script
# Run this script on your DigitalOcean droplet

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting LexCare AI Deployment on DigitalOcean${NC}"

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo apt-get update
sudo apt-get upgrade -y

# Install Docker
echo -e "${YELLOW}🐳 Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${GREEN} Docker installed successfully${NC}"
else
    echo -e "${GREEN} Docker already installed${NC}"
fi

# Install Docker Compose
echo -e "${YELLOW}🔧 Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo -e "${GREEN} Docker Compose installed successfully${NC}"
else
    echo -e "${GREEN} Docker Compose already installed${NC}"
fi

# Install other dependencies
echo -e "${YELLOW}🛠️ Installing additional dependencies...${NC}"
sudo apt-get install -y git curl nginx certbot python3-certbot-nginx ufw

# Configure firewall
echo -e "${YELLOW} Configuring firewall...${NC}"
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Create application directory
echo -e "${YELLOW} Setting up application directory...${NC}"
sudo mkdir -p /opt/lexcare-ai
sudo chown $USER:$USER /opt/lexcare-ai
cd /opt/lexcare-ai

# Clone or update repository (you'll need to replace with your repo URL)
if [ -d ".git" ]; then
    echo -e "${YELLOW} Updating existing repository...${NC}"
    git pull origin main
else
    echo -e "${YELLOW} Cloning repository...${NC}"
    # Replace with your actual repository URL
    read -p "Enter your Git repository URL: " REPO_URL
    git clone $REPO_URL .
fi

# Create environment file
echo -e "${YELLOW} Setting up environment variables...${NC}"
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cat > .env << EOL
# API Configuration
API_KEY=your_secure_api_key_here

# Groq API
GROQ_API_KEY=your_groq_api_key_here

# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_KEY=your_supabase_key_here

# Qdrant Configuration
QDRANT_URL=your_qdrant_url_here
QDRANT_API_KEY=your_qdrant_api_key_here

# Environment
ENVIRONMENT=production
EOL
    echo -e "${RED} Please edit .env file with your actual API keys!${NC}"
    echo -e "${YELLOW}Run: nano .env${NC}"
fi

# Create required directories
echo -e "${YELLOW} Creating required directories...${NC}"
mkdir -p sessions transcripts ssl logs

# Set proper permissions
sudo chown -R $USER:$USER /opt/lexcare-ai
chmod 755 sessions transcripts

echo -e "${GREEN} Deployment script completed!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Edit the .env file with your API keys: nano .env"
echo "2. Update domain in nginx.conf: nano nginx.conf"
echo "3. Build and start the application: docker-compose up -d"
echo "4. Set up SSL certificate: sudo certbot --nginx -d your-domain.com"
echo ""
echo -e "${GREEN} Your AI Service is ready to deploy!${NC}"