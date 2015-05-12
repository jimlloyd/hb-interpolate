# hb-interpolate
*Interpolate a json file through a [Handlebars](http://handlebarsjs.com/) template file to stdout.*

### About

`hb-interpolate` is a very simple command line tool that reads a `.json` file, and handlebars template file, performs the implied interpolation, and output the result to stdout.

### Usage

```
$ hb-interpolate --help

  Usage: hb-interpolate [options]

  Options:

    -h, --help             output usage information
    -j, --json [path]      JSON file with input data
    -t, --template [path]  Handlebars template to interpolate
    -n, --noEscape         Don't do HTML escaping

If the JSON file is a package.json, read-package-json is used to read the file.
Note that read-package-json normalizes some fields.
  `--json [path]` and `--tempate [path]` are REQUIRED.
```

### Notes

* The `--json [path]` and `--template [path]` arguments are required.
* If the basename of the json path is `package.json`, hb-interpolate uses the node package [read-package-json](https://www.npmjs.com/package/read-package-json) to read the file, which normalizes some fields, in particular all [people fields](https://docs.npmjs.com/files/package.json#people-fields-author-contributors). Any other json file is returned directly as read.
* The `--noEscape` option may be used to turn off Handlebars HTML escaping.

