module.exports = {
  apps: [
    {
      name: 'rocket-upload-server',
      script: './index.js',
      instances: 1,
      env: {
        NODE_ENV: 'dev',
        NODE_PORT: 3000
      },
      watch: ['src'],
      merge_logs: true,
      exec_mode: 'cluster',
      max_memory_restart: '600M',
      instance_var: 'NODE_APP_INSTANCE',
      log_date_format: 'YYYY-MM-DD HH:mm:ss'
    }
  ]
};
