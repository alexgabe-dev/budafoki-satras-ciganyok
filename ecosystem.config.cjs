module.exports = {
  apps: [
    {
      name: 'budafoki-satras-ciganyok',
      script: 'npm',
      args: 'start',
      cwd: '/var/www/budafoki-satras-ciganyok',
      env: {
        NODE_ENV: 'production',
        PORT: '7878',
        SQLITE_PATH: '/var/www/budafoki-satras-ciganyok/data/tickets.sqlite',
      },
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      log_file: '/home/alexgabe/logs/budafoki-satras-ciganyok.log',
      out_file: '/home/alexgabe/logs/budafoki-satras-ciganyok-out.log',
      error_file: '/home/alexgabe/logs/budafoki-satras-ciganyok-error.log',
      merge_logs: true,
      exec_mode: 'fork',
    },
  ],
};
