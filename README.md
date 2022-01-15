# PHPIPAM Action

This action Spin up a PHPIPAM instance for api testing purpose in github workflows.

## Inputs

**note** Input parameters are not used yet in our action. They are for future use. We need to work on that feature.

### `ipam_database_host`

**optional** Database host phpipam connects to. Default: "database"

### `ipam_database_user`

**optional** Database user phpipam needs to authenticate. Default: "phpipam"

### `ipam_database_pass`

**optional** Database password phpipam needs to authenticate Default: "phpipam"

### `ipam_database_name`

**optional** Database name phpipam uses. Default: "phpipam"

### `database_root_password`

**optional**  Root password for the database. Default: "root"

## Example usage

```yaml
steps:
  - uses: actions/checkout@v2
  - uses: codeaffen/phpipam-action@v1
    with:
      ipam_database_host: 'database'
      ipam_database_user: 'phpipam'
      ipam_database_pass: 'phpipamadmin'
      ipam_database_name: 'phpipam'
      database_root_password: 'rootpw'
```
