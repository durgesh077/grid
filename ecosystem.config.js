module.exports = {
  apps : [{
    name: "warranty_nft",
    script: "./index.js",
    instances: "max",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}