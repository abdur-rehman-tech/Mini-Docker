/**
 * @fileoverview The instance of Ajv validator.
 * @author Evgeny Poberezkin
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const Ajv = require("ajv"),
    metaSchema = require("ajv/lib/refs/json-schema-draft-06.json");

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = (additionalOptions = {}) => {
    const ajv = new Ajv({
        strict: "log",
        strictTuples: false,
        meta: false,
        useDefaults: true,
        validateSchema: false,
        verbose: true,
        schemaId: "auto",
        ...additionalOptions
    });

    ajv.addMetaSchema(metaSchema);
    ajv.opts.defaultMeta = metaSchema.id;

    return ajv;
};
