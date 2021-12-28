module.exports = {
  apps: [
    {
      name: 'rocket-upload-server',
      script: './index.js',
      instances: 1,
      env: {
        NODE_ENV: 'prod',
        NODE_PORT: 9833
      },
      watch: false,
      merge_logs: true,
      exec_mode: 'cluster',
      max_memory_restart: '600M',
      instance_var: 'NODE_APP_INSTANCE',
      log_date_format: 'YYYY-MM-DD HH:mm:ss',
      error_file: '/var/log/rocket-upload-server/pm2-rocket-upload-server-error.log',
      out_file: '/var/log/rocket-upload-server/pm2-rocket-upload-server-out.log'
    }
  ]
};
