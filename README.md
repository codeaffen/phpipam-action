# phpIPAM Action

[![CI](https://github.com/codeaffen/phpipam-action/actions/workflows/main.yml/badge.svg)](https://github.com/codeaffen/phpipam-action/actions/workflows/main.yml)
[![Codacy Badge](https://app.codacy.com/project/badge/Grade/944893481cbb43dea9335f9605c30c7e)](https://www.codacy.com/gh/codeaffen/phpipam-action/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=codeaffen/phpipam-action&amp;utm_campaign=Badge_Grade)

This action start a complete phpIPAM instance for api testing purpose in github workflows. \
In detail the action start two containers:

* a mariadb container with a phpipam database
* a phpipam container with a phpipam installation

After that the action does a few things to prepare the phpipam installation:

* populate the database with a default data
* activate the api
* create a app for api connection
* set required password change for defaut admin to _no_ - this is for local testing purposes

## Parameters

---
**Note:**

There are several parameters defined in readme. These parameters were currently not used but they are here for future use.

---

The parameters are prepared as follows:

* **ipam_database_host**: Database host phpipam connects to. Default: "database"
* **ipam_database_user**: Database user phpipam needs to authenticate. Default: "phpipam"
* **ipam_database_pass**: Database password phpipam needs to authenticate. Default: "phpipam"
* **ipam_database_name**: Database name phpipam uses. Default: "phpipam"
* **database_root_password**: Root password for the database. Default: "root"

## Usage

The action is hosted in a separate repository and available on [github marketplace](https://github.com/marketplace/actions/phpipam-action){:target="_blank"}. To use it you have to add the following to your github workflow:

~~~yaml
steps:
  - uses: actions/checkout@v2
  - uses: codeaffen/phpipam-action@v1
~~~

If the action finishes successfully you will be able to run your api tests against the phpipam installation.

~~~yaml
- name: "Test phpipam api"
        run: |
          curl -k --user Admin:ipamadmin -X POST https://localhost/api/ansible/user/
~~~
