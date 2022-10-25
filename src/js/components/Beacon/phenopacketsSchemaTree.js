export const phenopacketsSchemaTree = [{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "katsu:phenopackets:phenopacket",
    "title": "Phenopacket schema",
    "description": "An anonymous phenotypic description of an individual or biosample with potential genes of interest and/or diagnoses. The concept has multiple use-cases.",
    "type": "object",
    "properties": {
      "id": {
        "type": "string",
        "description": "Unique, arbitrary, researcher-specified identifier for the phenopacket.",
        "help": "Unique, arbitrary, researcher-specified identifier for the phenopacket.",
        "$id": "katsu:phenopackets:phenopacket:id",
        "search": {
          "operations": ["eq", "in"],
          "queryable": "all",
          "canNegate": true,
          "required": false,
          "order": 0,
          "type": "single",
          "database": {
            "field": "id"
          }
        }
      },
      "subject": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$id": "katsu:patients:individual",
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "A unique researcher-specified identifier for an individual.",
            "help": "A unique researcher-specified identifier for an individual.",
            "$id": "katsu:patients:individual:id",
            "search": {
              "operations": ["eq", "in"],
              "queryable": "all",
              "canNegate": true,
              "required": false,
              "order": 0,
              "type": "single",
              "database": {
                "field": "id"
              }
            }
          },
          "alternate_ids": {
            "type": "array",
            "items": {
              "type": "string",
              "description": "One of possibly many alternative identifiers for an individual.",
              "help": "One of possibly many alternative identifiers for an individual.",
              "$id": "katsu:patients:individual:alternate_ids:item",
              "search": {
                "operations": ["eq", "ico", "in"],
                "queryable": "internal",
                "canNegate": true,
                "required": false,
                "order": 1,
                "type": "multiple"
              }
            },
            "description": "A list of alternative identifiers for an individual.",
            "help": "A list of alternative identifiers for an individual.",
            "$id": "katsu:patients:individual:alternate_ids",
            "search": {
              "database": {
                "type": "array"
              }
            }
          },
          "date_of_birth": {
            "type": "string",
            "description": "A timestamp representing an individual's date of birth; either exactly or imprecisely.",
            "help": "A timestamp representing an individual's date of birth; either exactly or imprecisely.",
            "$id": "katsu:patients:individual:date_of_birth",
            "search": {
              "operations": ["eq", "in"],
              "queryable": "internal",
              "canNegate": true,
              "required": false,
              "order": 2,
              "type": "single"
            }
          },
          "age": {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "$id": "katsu:common:age_or_age_range",
            "title": "Age schema",
            "description": "The age or age range of the individual.",
            "type": "object",
            "oneOf": [
              {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "katsu:common:age",
                "title": "Age schema",
                "type": "object",
                "properties": {
                  "age": {
                    "$schema": "http://json-schema.org/draft-07/schema#",
                    "$id": "katsu:common:age_string",
                    "type": "string",
                    "description": "An ISO8601 duration string (e.g. P40Y10M05D for 40 years, 10 months, 5 days) representing an age of a subject.",
                    "help": "Age of a subject."
                  }
                },
                "additionalProperties": false,
                "required": ["age"],
                "description": "An ISO8601 duration string (e.g. P40Y10M05D for 40 years, 10 months, 5 days) representing an age of a subject.",
                "help": "An ISO8601 duration string (e.g. P40Y10M05D for 40 years, 10 months, 5 days) representing an age of a subject."
              },
              {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "katsu:common:age_range",
                "title": "Age range schema",
                "type": "object",
                "properties": {
                  "start": {
                    "$schema": "http://json-schema.org/draft-07/schema#",
                    "$id": "katsu:common:age",
                    "title": "Age schema",
                    "type": "object",
                    "properties": {
                      "age": {
                        "$schema": "http://json-schema.org/draft-07/schema#",
                        "$id": "katsu:common:age_string",
                        "type": "string",
                        "description": "An ISO8601 duration string (e.g. P40Y10M05D for 40 years, 10 months, 5 days) representing an age of a subject.",
                        "help": "Age of a subject."
                      }
                    },
                    "additionalProperties": false,
                    "required": ["age"],
                    "description": "An ISO8601 duration string representing the start of the age range bin.",
                    "help": "An ISO8601 duration string representing the start of the age range bin."
                  },
                  "end": {
                    "$schema": "http://json-schema.org/draft-07/schema#",
                    "$id": "katsu:common:age",
                    "title": "Age schema",
                    "type": "object",
                    "properties": {
                      "age": {
                        "$schema": "http://json-schema.org/draft-07/schema#",
                        "$id": "katsu:common:age_string",
                        "type": "string",
                        "description": "An ISO8601 duration string (e.g. P40Y10M05D for 40 years, 10 months, 5 days) representing an age of a subject.",
                        "help": "Age of a subject."
                      }
                    },
                    "additionalProperties": false,
                    "required": ["age"],
                    "description": "An ISO8601 duration string representing the end of the age range bin.",
                    "help": "An ISO8601 duration string representing the end of the age range bin."
                  }
                },
                "additionalProperties": false,
                "required": ["start", "end"],
                "description": "Age range of a subject (e.g. when a subject's age falls into a bin.)",
                "help": "Age range of a subject (e.g. when a subject's age falls into a bin.)"
              }
            ],
            "help": "The age or age range of the individual."
          },
          "sex": {
            "type": "string",
            "enum": ["UNKNOWN_SEX", "FEMALE", "MALE", "OTHER_SEX"],
            "description": "The phenotypic sex of an individual, as would be determined by a midwife or physician at birth.",
            "help": "The phenotypic sex of an individual, as would be determined by a midwife or physician at birth.",
            "$id": "katsu:patients:individual:sex",
            "search": {
              "operations": ["eq", "in"],
              "queryable": "all",
              "canNegate": true,
              "required": false,
              "order": 3,
              "type": "single"
            }
          },
          "karyotypic_sex": {
            "type": "string",
            "enum": [
              "UNKNOWN_KARYOTYPE",
              "XX",
              "XY",
              "XO",
              "XXY",
              "XXX",
              "XXYY",
              "XXXY",
              "XXXX",
              "XYY",
              "OTHER_KARYOTYPE"
            ],
            "description": "The karyotypic sex of an individual.",
            "help": "The karyotypic sex of an individual.",
            "$id": "katsu:patients:individual:karyotypic_sex",
            "search": {
              "operations": ["eq", "in"],
              "queryable": "all",
              "canNegate": true,
              "required": false,
              "order": 4,
              "type": "single"
            }
          },
          "taxonomy": {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "$id": "katsu:common:ontology_class",
            "title": "Ontology class schema",
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "description": "A CURIE-style identifier for an ontology term specified when more than one organism may be studied. It is advised that codesfrom the NCBI Taxonomy resource are used, e.g. NCBITaxon:9606 for humans.",
                "help": "A CURIE-style identifier for an ontology term specified when more than one organism may be studied. It is advised that codesfrom the NCBI Taxonomy resource are used, e.g. NCBITaxon:9606 for humans.",
                "$id": "katsu:common:ontology_class:id",
                "search": {
                  "operations": ["eq", "ico", "in"],
                  "queryable": "all",
                  "canNegate": true,
                  "required": false,
                  "order": 0,
                  "type": "multiple"
                }
              },
              "label": {
                "type": "string",
                "description": "A human readable class name for an ontology term specified when more than one organism may be studied. It is advised that codesfrom the NCBI Taxonomy resource are used, e.g. NCBITaxon:9606 for humans.",
                "help": "A human readable class name for an ontology term specified when more than one organism may be studied. It is advised that codesfrom the NCBI Taxonomy resource are used, e.g. NCBITaxon:9606 for humans.",
                "$id": "katsu:common:ontology_class:label",
                "search": {
                  "operations": ["eq", "ico", "in"],
                  "queryable": "all",
                  "canNegate": true,
                  "required": false,
                  "order": 1,
                  "type": "multiple"
                }
              }
            },
            "additionalProperties": false,
            "required": ["id", "label"],
            "description": "An ontology term specified when more than one organism may be studied. It is advised that codesfrom the NCBI Taxonomy resource are used, e.g. NCBITaxon:9606 for humans.",
            "help": "An ontology term specified when more than one organism may be studied. It is advised that codesfrom the NCBI Taxonomy resource are used, e.g. NCBITaxon:9606 for humans.",
            "search": {
              "database": {
                "type": "jsonb"
              }
            }
          },
          "active": {
            "type": "boolean",
            "description": "Whether a patient's record is in active use.",
            "help": "FHIR-specific property.",
            "$id": "katsu:patients:individual:active"
          },
          "deceased": {
            "type": "boolean",
            "description": "Whether a patient is deceased.",
            "help": "FHIR-specific property.",
            "$id": "katsu:patients:individual:deceased"
          },
          "race": {
            "type": "string",
            "description": "A code for a person's race (mCode).",
            "help": "mCode-specific property.",
            "$id": "katsu:patients:individual:race"
          },
          "ethnicity": {
            "type": "string",
            "description": "A code for a person's ethnicity (mCode).",
            "help": "mCode-specific property.",
            "$id": "katsu:patients:individual:ethnicity"
          },
          "comorbid_condition": {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "$id": "chord_metadata_service:comorbid_condition_schema",
            "title": "Comorbid Condition schema",
            "description": "One or more conditions that occur with primary condition.",
            "type": "object",
            "properties": {
              "clinical_status": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "katsu:common:ontology_class",
                "title": "Ontology class schema",
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "description": "A CURIE-style identifier for an ontology term.",
                    "help": "A CURIE-style identifier for an ontology term.",
                    "$id": "katsu:common:ontology_class:id"
                  },
                  "label": {
                    "type": "string",
                    "description": "A human readable class name for an ontology term.",
                    "help": "A human readable class name for an ontology term.",
                    "$id": "katsu:common:ontology_class:label"
                  }
                },
                "additionalProperties": false,
                "required": ["id", "label"],
                "description": "An ontology term.",
                "help": "An ontology term."
              },
              "code": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "katsu:common:ontology_class",
                "title": "Ontology class schema",
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "description": "A CURIE-style identifier for an ontology term.",
                    "help": "A CURIE-style identifier for an ontology term.",
                    "$id": "katsu:common:ontology_class:id"
                  },
                  "label": {
                    "type": "string",
                    "description": "A human readable class name for an ontology term.",
                    "help": "A human readable class name for an ontology term.",
                    "$id": "katsu:common:ontology_class:label"
                  }
                },
                "additionalProperties": false,
                "required": ["id", "label"],
                "description": "An ontology term.",
                "help": "An ontology term."
              }
            },
            "required": [],
            "additionalProperties": false,
            "help": "mCode-specific property."
          },
          "ecog_performance_status": {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "$id": "katsu:common:ontology_class",
            "title": "Ontology class schema",
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "description": "A CURIE-style identifier for an ontology term.",
                "help": "A CURIE-style identifier for an ontology term.",
                "$id": "katsu:common:ontology_class:id"
              },
              "label": {
                "type": "string",
                "description": "A human readable class name for an ontology term.",
                "help": "A human readable class name for an ontology term.",
                "$id": "katsu:common:ontology_class:label"
              }
            },
            "additionalProperties": false,
            "required": ["id", "label"],
            "description": "Value representing the Eastern Cooperative Oncology Group performance status.",
            "help": "mCode-specific property."
          },
          "karnofsky": {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "$id": "katsu:common:ontology_class",
            "title": "Ontology class schema",
            "type": "object",
            "properties": {
              "id": {
                "type": "string",
                "description": "A CURIE-style identifier for an ontology term.",
                "help": "A CURIE-style identifier for an ontology term.",
                "$id": "katsu:common:ontology_class:id"
              },
              "label": {
                "type": "string",
                "description": "A human readable class name for an ontology term.",
                "help": "A human readable class name for an ontology term.",
                "$id": "katsu:common:ontology_class:label"
              }
            },
            "additionalProperties": false,
            "required": ["id", "label"],
            "description": "Value representing the Karnofsky Performance status.",
            "help": "mCode-specific property."
          },
          "extra_properties": {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "$id": "katsu:common:extra_properties",
            "type": "object",
            "help": "Extra properties that are not supported by current schema."
          }
        },
        "required": ["id"],
        "description": "A subject of a phenopacket, representing either a human (typically) or another organism.",
        "help": "A subject of a phenopacket, representing either a human (typically) or another organism.",
        "search": {
          "database": {
            "relation": "patients_individual",
            "primary_key": "id",
            "relationship": {
              "type": "MANY_TO_ONE",
              "foreign_key": "subject_id"
            }
          }
        }
      },
      "phenotypic_features": {
        "type": "array",
        "items": {
          "$schema": "http://json-schema.org/draft-07/schema#",
          "$id": "katsu:phenopackets:phenotypic_feature",
          "type": "object",
          "properties": {
            "description": {
              "type": "string",
              "description": "Human-readable text describing the phenotypic feature; NOT for structured text.",
              "help": "Human-readable text describing the phenotypic feature; NOT for structured text.",
              "$id": "katsu:phenopackets:phenotypic_feature:description",
              "search": {
                "operations": ["eq", "ico", "in"],
                "queryable": "all",
                "canNegate": true,
                "required": false,
                "order": 0,
                "type": "multiple"
              }
            },
            "type": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:common:ontology_class",
              "title": "Ontology class schema",
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "description": "A CURIE-style identifier for an ontology term which describes the phenotype.",
                  "help": "A CURIE-style identifier for an ontology term which describes the phenotype.",
                  "$id": "katsu:common:ontology_class:id",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 0,
                    "type": "multiple"
                  }
                },
                "label": {
                  "type": "string",
                  "description": "A human readable class name for an ontology term which describes the phenotype.",
                  "help": "A human readable class name for an ontology term which describes the phenotype.",
                  "$id": "katsu:common:ontology_class:label",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 1,
                    "type": "multiple"
                  }
                }
              },
              "additionalProperties": false,
              "required": ["id", "label"],
              "description": "An ontology term which describes the phenotype.",
              "help": "An ontology term which describes the phenotype.",
              "search": {
                "database": {
                  "type": "jsonb",
                  "field": "pftype"
                }
              }
            },
            "negated": {
              "type": "boolean",
              "description": "Whether the feature is present (false) or absent (true, feature is negated); default is false.",
              "help": "Whether the feature is present (false) or absent (true, feature is negated); default is false.",
              "$id": "katsu:phenopackets:phenotypic_feature:negated",
              "search": {
                "operations": ["eq", "in"],
                "queryable": "all",
                "canNegate": true,
                "required": false,
                "order": 1,
                "type": "single"
              }
            },
            "severity": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:common:ontology_class",
              "title": "Ontology class schema",
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "description": "A CURIE-style identifier for an ontology term that describes the severity of the condition.",
                  "help": "A CURIE-style identifier for an ontology term that describes the severity of the condition.",
                  "$id": "katsu:common:ontology_class:id",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 0,
                    "type": "multiple"
                  }
                },
                "label": {
                  "type": "string",
                  "description": "A human readable class name for an ontology term that describes the severity of the condition.",
                  "help": "A human readable class name for an ontology term that describes the severity of the condition.",
                  "$id": "katsu:common:ontology_class:label",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 1,
                    "type": "multiple"
                  }
                }
              },
              "additionalProperties": false,
              "required": ["id", "label"],
              "description": "An ontology term that describes the severity of the condition.",
              "help": "An ontology term that describes the severity of the condition.",
              "search": {
                "database": {
                  "type": "jsonb"
                }
              }
            },
            "modifier": {
              "type": "array",
              "items": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "katsu:common:ontology_class",
                "title": "Ontology class schema",
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "description": "A CURIE-style identifier for an ontology term that expounds on the phenotypic feature.",
                    "help": "A CURIE-style identifier for an ontology term that expounds on the phenotypic feature.",
                    "$id": "katsu:common:ontology_class:id",
                    "search": {
                      "operations": ["eq", "ico", "in"],
                      "queryable": "all",
                      "canNegate": true,
                      "required": false,
                      "order": 0,
                      "type": "multiple"
                    }
                  },
                  "label": {
                    "type": "string",
                    "description": "A human readable class name for an ontology term that expounds on the phenotypic feature.",
                    "help": "A human readable class name for an ontology term that expounds on the phenotypic feature.",
                    "$id": "katsu:common:ontology_class:label",
                    "search": {
                      "operations": ["eq", "ico", "in"],
                      "queryable": "all",
                      "canNegate": true,
                      "required": false,
                      "order": 1,
                      "type": "multiple"
                    }
                  }
                },
                "additionalProperties": false,
                "required": ["id", "label"],
                "description": "An ontology term that expounds on the phenotypic feature.",
                "help": "An ontology term that expounds on the phenotypic feature.",
                "search": {
                  "database": {
                    "type": "jsonb"
                  }
                }
              },
              "description": "A list of ontology terms that provide more expressive / precise descriptions of a phenotypic feature, including e.g. positionality or external factors.",
              "help": "A list of ontology terms that provide more expressive / precise descriptions of a phenotypic feature, including e.g. positionality or external factors.",
              "$id": "katsu:phenopackets:phenotypic_feature:modifier"
            },
            "onset": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:common:ontology_class",
              "title": "Ontology class schema",
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "description": "A CURIE-style identifier for an ontology term that describes the age at which the phenotypic feature was first noticed or diagnosed, e.g. HP:0003674.",
                  "help": "A CURIE-style identifier for an ontology term that describes the age at which the phenotypic feature was first noticed or diagnosed, e.g. HP:0003674.",
                  "$id": "katsu:common:ontology_class:id",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 0,
                    "type": "multiple"
                  }
                },
                "label": {
                  "type": "string",
                  "description": "A human readable class name for an ontology term that describes the age at which the phenotypic feature was first noticed or diagnosed, e.g. HP:0003674.",
                  "help": "A human readable class name for an ontology term that describes the age at which the phenotypic feature was first noticed or diagnosed, e.g. HP:0003674.",
                  "$id": "katsu:common:ontology_class:label",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 1,
                    "type": "multiple"
                  }
                }
              },
              "additionalProperties": false,
              "required": ["id", "label"],
              "description": "An ontology term that describes the age at which the phenotypic feature was first noticed or diagnosed, e.g. HP:0003674.",
              "help": "An ontology term that describes the age at which the phenotypic feature was first noticed or diagnosed, e.g. HP:0003674.",
              "search": {
                "database": {
                  "type": "jsonb"
                }
              }
            },
            "evidence": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:phenopackets:evidence",
              "title": "Evidence schema",
              "type": "object",
              "properties": {
                "evidence_code": {
                  "$schema": "http://json-schema.org/draft-07/schema#",
                  "$id": "katsu:common:ontology_class",
                  "title": "Ontology class schema",
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "description": "A CURIE-style identifier for an ontology term that represents the evidence type.",
                      "help": "A CURIE-style identifier for an ontology term that represents the evidence type.",
                      "$id": "katsu:common:ontology_class:id",
                      "search": {
                        "operations": ["eq", "ico", "in"],
                        "queryable": "all",
                        "canNegate": true,
                        "required": false,
                        "order": 0,
                        "type": "multiple"
                      }
                    },
                    "label": {
                      "type": "string",
                      "description": "A human readable class name for an ontology term that represents the evidence type.",
                      "help": "A human readable class name for an ontology term that represents the evidence type.",
                      "$id": "katsu:common:ontology_class:label",
                      "search": {
                        "operations": ["eq", "ico", "in"],
                        "queryable": "all",
                        "canNegate": true,
                        "required": false,
                        "order": 1,
                        "type": "multiple"
                      }
                    }
                  },
                  "additionalProperties": false,
                  "required": ["id", "label"],
                  "description": "An ontology term that represents the evidence type.",
                  "help": "An ontology term that represents the evidence type.",
                  "search": {
                    "database": {
                      "type": "jsonb"
                    }
                  }
                },
                "reference": {
                  "$schema": "http://json-schema.org/draft-07/schema#",
                  "$id": "katsu:phenopackets:external_reference",
                  "title": "External reference schema",
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "description": "An application-specific identifier. It is RECOMMENDED that this is a CURIE that uniquely identifies the evidence source when combined with a resource; e.g. PMID:123456 with a resource `pmid`. It could also be a URI or other relevant identifier.",
                      "help": "An application-specific identifier. It is RECOMMENDED that this is a CURIE that uniquely identifies the evidence source when combined with a resource; e.g. PMID:123456 with a resource `pmid`. It could also be a URI or other relevant identifier.",
                      "$id": "katsu:phenopackets:external_reference:id",
                      "search": {
                        "operations": ["eq", "ico", "in"],
                        "queryable": "all",
                        "canNegate": true,
                        "required": false,
                        "order": 0,
                        "type": "single"
                      }
                    },
                    "description": {
                      "type": "string",
                      "description": "An application-specific free-text description.",
                      "help": "An application-specific free-text description.",
                      "$id": "katsu:phenopackets:external_reference:description",
                      "search": {
                        "operations": ["eq", "ico", "in"],
                        "queryable": "all",
                        "canNegate": true,
                        "required": false,
                        "order": 1,
                        "type": "multiple"
                      }
                    }
                  },
                  "required": ["id"],
                  "description": "An encoding of information about a reference to an external resource.",
                  "help": "An encoding of information about a reference to an external resource.",
                  "search": {
                    "database": {
                      "type": "jsonb"
                    }
                  }
                }
              },
              "additionalProperties": false,
              "required": ["evidence_code"],
              "description": "One or more pieces of evidence that specify how the phenotype was determined.",
              "help": "One or more pieces of evidence that specify how the phenotype was determined.",
              "search": {
                "database": {
                  "type": "jsonb"
                }
              }
            },
            "extra_properties": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:common:extra_properties",
              "type": "object",
              "help": "Extra properties that are not supported by current schema."
            }
          },
          "description": "A description of a phenotype that characterizes the proband of a Phenopacket.",
          "help": "A description of a phenotype that characterizes the proband of a Phenopacket.",
          "search": {
            "database": {
              "relation": "phenopackets_phenotypicfeature",
              "primary_key": "id",
              "relationship": {
                "type": "MANY_TO_ONE",
                "foreign_key": "id"
              }
            }
          }
        },
        "description": "A list of phenotypic features observed in the proband.",
        "help": "A list of phenotypic features observed in the proband.",
        "$id": "katsu:phenopackets:phenopacket:phenotypic_features",
        "search": {
          "database": {
            "relation": "phenopackets_phenotypicfeature",
            "primary_key": "id",
            "relationship": {
              "type": "ONE_TO_MANY",
              "parent_foreign_key": "phenopacket_id",
              "parent_primary_key": "id"
            }
          }
        }
      },
      "biosamples": {
        "type": "array",
        "items": {
          "$schema": "http://json-schema.org/draft-07/schema#",
          "$id": "katsu:phenopackets:biosample",
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Unique arbitrary, researcher-specified identifier for the biosample.",
              "help": "Unique arbitrary, researcher-specified identifier for the biosample.",
              "$id": "katsu:phenopackets:biosample:id",
              "search": {
                "operations": ["eq", "in"],
                "queryable": "all",
                "canNegate": true,
                "required": false,
                "order": 0,
                "type": "single",
                "database": {
                  "field": "id"
                }
              }
            },
            "individual_id": {
              "type": "string",
              "description": "Identifier for the individual this biosample was sampled from.",
              "help": "Identifier for the individual this biosample was sampled from.",
              "$id": "katsu:phenopackets:biosample:individual_id",
              "search": {
                "operations": ["eq", "in"],
                "queryable": "internal",
                "canNegate": true,
                "required": false,
                "order": 1,
                "type": "single"
              }
            },
            "description": {
              "type": "string",
              "description": "Human-readable, unstructured text describing the biosample or providing additional information.",
              "help": "Human-readable, unstructured text describing the biosample or providing additional information.",
              "$id": "katsu:phenopackets:biosample:description",
              "search": {
                "operations": ["eq", "ico", "in"],
                "queryable": "all",
                "canNegate": true,
                "required": false,
                "order": 2,
                "type": "multiple"
              }
            },
            "sampled_tissue": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:common:ontology_class",
              "title": "Ontology class schema",
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "description": "A CURIE-style identifier for an ontology term describing the tissue from which the specimen was collected. The use of UBERON is recommended.",
                  "help": "A CURIE-style identifier for an ontology term describing the tissue from which the specimen was collected. The use of UBERON is recommended.",
                  "$id": "katsu:common:ontology_class:id",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 0,
                    "type": "multiple"
                  }
                },
                "label": {
                  "type": "string",
                  "description": "A human readable class name for an ontology term describing the tissue from which the specimen was collected. The use of UBERON is recommended.",
                  "help": "A human readable class name for an ontology term describing the tissue from which the specimen was collected. The use of UBERON is recommended.",
                  "$id": "katsu:common:ontology_class:label",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 1,
                    "type": "multiple"
                  }
                }
              },
              "additionalProperties": false,
              "required": ["id", "label"],
              "description": "An ontology term describing the tissue from which the specimen was collected. The use of UBERON is recommended.",
              "help": "An ontology term describing the tissue from which the specimen was collected. The use of UBERON is recommended.",
              "search": {
                "database": {
                  "type": "jsonb"
                }
              }
            },
            "phenotypic_features": {
              "type": "array",
              "items": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "katsu:phenopackets:phenotypic_feature",
                "type": "object",
                "properties": {
                  "description": {
                    "type": "string",
                    "description": "Human-readable text describing the phenotypic feature; NOT for structured text.",
                    "help": "Human-readable text describing the phenotypic feature; NOT for structured text.",
                    "$id": "katsu:phenopackets:phenotypic_feature:description",
                    "search": {
                      "operations": ["eq", "ico", "in"],
                      "queryable": "all",
                      "canNegate": true,
                      "required": false,
                      "order": 0,
                      "type": "multiple"
                    }
                  },
                  "type": {
                    "$schema": "http://json-schema.org/draft-07/schema#",
                    "$id": "katsu:common:ontology_class",
                    "title": "Ontology class schema",
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "description": "A CURIE-style identifier for an ontology term which describes the phenotype.",
                        "help": "A CURIE-style identifier for an ontology term which describes the phenotype.",
                        "$id": "katsu:common:ontology_class:id",
                        "search": {
                          "operations": ["eq", "ico", "in"],
                          "queryable": "all",
                          "canNegate": true,
                          "required": false,
                          "order": 0,
                          "type": "multiple"
                        }
                      },
                      "label": {
                        "type": "string",
                        "description": "A human readable class name for an ontology term which describes the phenotype.",
                        "help": "A human readable class name for an ontology term which describes the phenotype.",
                        "$id": "katsu:common:ontology_class:label",
                        "search": {
                          "operations": ["eq", "ico", "in"],
                          "queryable": "all",
                          "canNegate": true,
                          "required": false,
                          "order": 1,
                          "type": "multiple"
                        }
                      }
                    },
                    "additionalProperties": false,
                    "required": ["id", "label"],
                    "description": "An ontology term which describes the phenotype.",
                    "help": "An ontology term which describes the phenotype.",
                    "search": {
                      "database": {
                        "type": "jsonb",
                        "field": "pftype"
                      }
                    }
                  },
                  "negated": {
                    "type": "boolean",
                    "description": "Whether the feature is present (false) or absent (true, feature is negated); default is false.",
                    "help": "Whether the feature is present (false) or absent (true, feature is negated); default is false.",
                    "$id": "katsu:phenopackets:phenotypic_feature:negated",
                    "search": {
                      "operations": ["eq", "in"],
                      "queryable": "all",
                      "canNegate": true,
                      "required": false,
                      "order": 1,
                      "type": "single"
                    }
                  },
                  "severity": {
                    "$schema": "http://json-schema.org/draft-07/schema#",
                    "$id": "katsu:common:ontology_class",
                    "title": "Ontology class schema",
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "description": "A CURIE-style identifier for an ontology term that describes the severity of the condition.",
                        "help": "A CURIE-style identifier for an ontology term that describes the severity of the condition.",
                        "$id": "katsu:common:ontology_class:id",
                        "search": {
                          "operations": ["eq", "ico", "in"],
                          "queryable": "all",
                          "canNegate": true,
                          "required": false,
                          "order": 0,
                          "type": "multiple"
                        }
                      },
                      "label": {
                        "type": "string",
                        "description": "A human readable class name for an ontology term that describes the severity of the condition.",
                        "help": "A human readable class name for an ontology term that describes the severity of the condition.",
                        "$id": "katsu:common:ontology_class:label",
                        "search": {
                          "operations": ["eq", "ico", "in"],
                          "queryable": "all",
                          "canNegate": true,
                          "required": false,
                          "order": 1,
                          "type": "multiple"
                        }
                      }
                    },
                    "additionalProperties": false,
                    "required": ["id", "label"],
                    "description": "An ontology term that describes the severity of the condition.",
                    "help": "An ontology term that describes the severity of the condition.",
                    "search": {
                      "database": {
                        "type": "jsonb"
                      }
                    }
                  },
                  "modifier": {
                    "type": "array",
                    "items": {
                      "$schema": "http://json-schema.org/draft-07/schema#",
                      "$id": "katsu:common:ontology_class",
                      "title": "Ontology class schema",
                      "type": "object",
                      "properties": {
                        "id": {
                          "type": "string",
                          "description": "A CURIE-style identifier for an ontology term that expounds on the phenotypic feature.",
                          "help": "A CURIE-style identifier for an ontology term that expounds on the phenotypic feature.",
                          "$id": "katsu:common:ontology_class:id",
                          "search": {
                            "operations": ["eq", "ico", "in"],
                            "queryable": "all",
                            "canNegate": true,
                            "required": false,
                            "order": 0,
                            "type": "multiple"
                          }
                        },
                        "label": {
                          "type": "string",
                          "description": "A human readable class name for an ontology term that expounds on the phenotypic feature.",
                          "help": "A human readable class name for an ontology term that expounds on the phenotypic feature.",
                          "$id": "katsu:common:ontology_class:label",
                          "search": {
                            "operations": ["eq", "ico", "in"],
                            "queryable": "all",
                            "canNegate": true,
                            "required": false,
                            "order": 1,
                            "type": "multiple"
                          }
                        }
                      },
                      "additionalProperties": false,
                      "required": ["id", "label"],
                      "description": "An ontology term that expounds on the phenotypic feature.",
                      "help": "An ontology term that expounds on the phenotypic feature.",
                      "search": {
                        "database": {
                          "type": "jsonb"
                        }
                      }
                    },
                    "description": "A list of ontology terms that provide more expressive / precise descriptions of a phenotypic feature, including e.g. positionality or external factors.",
                    "help": "A list of ontology terms that provide more expressive / precise descriptions of a phenotypic feature, including e.g. positionality or external factors.",
                    "$id": "katsu:phenopackets:phenotypic_feature:modifier"
                  },
                  "onset": {
                    "$schema": "http://json-schema.org/draft-07/schema#",
                    "$id": "katsu:common:ontology_class",
                    "title": "Ontology class schema",
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "description": "A CURIE-style identifier for an ontology term that describes the age at which the phenotypic feature was first noticed or diagnosed, e.g. HP:0003674.",
                        "help": "A CURIE-style identifier for an ontology term that describes the age at which the phenotypic feature was first noticed or diagnosed, e.g. HP:0003674.",
                        "$id": "katsu:common:ontology_class:id",
                        "search": {
                          "operations": ["eq", "ico", "in"],
                          "queryable": "all",
                          "canNegate": true,
                          "required": false,
                          "order": 0,
                          "type": "multiple"
                        }
                      },
                      "label": {
                        "type": "string",
                        "description": "A human readable class name for an ontology term that describes the age at which the phenotypic feature was first noticed or diagnosed, e.g. HP:0003674.",
                        "help": "A human readable class name for an ontology term that describes the age at which the phenotypic feature was first noticed or diagnosed, e.g. HP:0003674.",
                        "$id": "katsu:common:ontology_class:label",
                        "search": {
                          "operations": ["eq", "ico", "in"],
                          "queryable": "all",
                          "canNegate": true,
                          "required": false,
                          "order": 1,
                          "type": "multiple"
                        }
                      }
                    },
                    "additionalProperties": false,
                    "required": ["id", "label"],
                    "description": "An ontology term that describes the age at which the phenotypic feature was first noticed or diagnosed, e.g. HP:0003674.",
                    "help": "An ontology term that describes the age at which the phenotypic feature was first noticed or diagnosed, e.g. HP:0003674.",
                    "search": {
                      "database": {
                        "type": "jsonb"
                      }
                    }
                  },
                  "evidence": {
                    "$schema": "http://json-schema.org/draft-07/schema#",
                    "$id": "katsu:phenopackets:evidence",
                    "title": "Evidence schema",
                    "type": "object",
                    "properties": {
                      "evidence_code": {
                        "$schema": "http://json-schema.org/draft-07/schema#",
                        "$id": "katsu:common:ontology_class",
                        "title": "Ontology class schema",
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "description": "A CURIE-style identifier for an ontology term that represents the evidence type.",
                            "help": "A CURIE-style identifier for an ontology term that represents the evidence type.",
                            "$id": "katsu:common:ontology_class:id",
                            "search": {
                              "operations": ["eq", "ico", "in"],
                              "queryable": "all",
                              "canNegate": true,
                              "required": false,
                              "order": 0,
                              "type": "multiple"
                            }
                          },
                          "label": {
                            "type": "string",
                            "description": "A human readable class name for an ontology term that represents the evidence type.",
                            "help": "A human readable class name for an ontology term that represents the evidence type.",
                            "$id": "katsu:common:ontology_class:label",
                            "search": {
                              "operations": ["eq", "ico", "in"],
                              "queryable": "all",
                              "canNegate": true,
                              "required": false,
                              "order": 1,
                              "type": "multiple"
                            }
                          }
                        },
                        "additionalProperties": false,
                        "required": ["id", "label"],
                        "description": "An ontology term that represents the evidence type.",
                        "help": "An ontology term that represents the evidence type.",
                        "search": {
                          "database": {
                            "type": "jsonb"
                          }
                        }
                      },
                      "reference": {
                        "$schema": "http://json-schema.org/draft-07/schema#",
                        "$id": "katsu:phenopackets:external_reference",
                        "title": "External reference schema",
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "description": "An application-specific identifier. It is RECOMMENDED that this is a CURIE that uniquely identifies the evidence source when combined with a resource; e.g. PMID:123456 with a resource `pmid`. It could also be a URI or other relevant identifier.",
                            "help": "An application-specific identifier. It is RECOMMENDED that this is a CURIE that uniquely identifies the evidence source when combined with a resource; e.g. PMID:123456 with a resource `pmid`. It could also be a URI or other relevant identifier.",
                            "$id": "katsu:phenopackets:external_reference:id",
                            "search": {
                              "operations": ["eq", "ico", "in"],
                              "queryable": "all",
                              "canNegate": true,
                              "required": false,
                              "order": 0,
                              "type": "single"
                            }
                          },
                          "description": {
                            "type": "string",
                            "description": "An application-specific free-text description.",
                            "help": "An application-specific free-text description.",
                            "$id": "katsu:phenopackets:external_reference:description",
                            "search": {
                              "operations": ["eq", "ico", "in"],
                              "queryable": "all",
                              "canNegate": true,
                              "required": false,
                              "order": 1,
                              "type": "multiple"
                            }
                          }
                        },
                        "required": ["id"],
                        "description": "An encoding of information about a reference to an external resource.",
                        "help": "An encoding of information about a reference to an external resource.",
                        "search": {
                          "database": {
                            "type": "jsonb"
                          }
                        }
                      }
                    },
                    "additionalProperties": false,
                    "required": ["evidence_code"],
                    "description": "One or more pieces of evidence that specify how the phenotype was determined.",
                    "help": "One or more pieces of evidence that specify how the phenotype was determined.",
                    "search": {
                      "database": {
                        "type": "jsonb"
                      }
                    }
                  },
                  "extra_properties": {
                    "$schema": "http://json-schema.org/draft-07/schema#",
                    "$id": "katsu:common:extra_properties",
                    "type": "object",
                    "help": "Extra properties that are not supported by current schema."
                  }
                },
                "description": "A description of a phenotype that characterizes a biosample of a Phenopacket.",
                "help": "A description of a phenotype that characterizes a biosample of a Phenopacket.",
                "search": {
                  "database": {
                    "relation": "phenopackets_phenotypicfeature",
                    "primary_key": "id",
                    "relationship": {
                      "type": "MANY_TO_ONE",
                      "foreign_key": "phenotypicfeature_id"
                    }
                  }
                }
              },
              "description": "A list of phenotypic features / abnormalities of the sample.",
              "help": "A list of phenotypic features / abnormalities of the sample.",
              "$id": "katsu:phenopackets:biosample:phenotypic_features",
              "search": {
                "database": {
                  "relation": "phenopackets_phenotypicfeature",
                  "primary_key": "id",
                  "relationship": {
                    "type": "ONE_TO_MANY",
                    "parent_foreign_key": "biosample_id",
                    "parent_primary_key": "id"
                  }
                }
              }
            },
            "taxonomy": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:common:ontology_class",
              "title": "Ontology class schema",
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "description": "A CURIE-style identifier for an ontology term specified when more than one organism may be studied. It is advised that codesfrom the NCBI Taxonomy resource are used, e.g. NCBITaxon:9606 for humans.",
                  "help": "A CURIE-style identifier for an ontology term specified when more than one organism may be studied. It is advised that codesfrom the NCBI Taxonomy resource are used, e.g. NCBITaxon:9606 for humans.",
                  "$id": "katsu:common:ontology_class:id",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 0,
                    "type": "multiple"
                  }
                },
                "label": {
                  "type": "string",
                  "description": "A human readable class name for an ontology term specified when more than one organism may be studied. It is advised that codesfrom the NCBI Taxonomy resource are used, e.g. NCBITaxon:9606 for humans.",
                  "help": "A human readable class name for an ontology term specified when more than one organism may be studied. It is advised that codesfrom the NCBI Taxonomy resource are used, e.g. NCBITaxon:9606 for humans.",
                  "$id": "katsu:common:ontology_class:label",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 1,
                    "type": "multiple"
                  }
                }
              },
              "additionalProperties": false,
              "required": ["id", "label"],
              "description": "An ontology term specified when more than one organism may be studied. It is advised that codesfrom the NCBI Taxonomy resource are used, e.g. NCBITaxon:9606 for humans.",
              "help": "An ontology term specified when more than one organism may be studied. It is advised that codesfrom the NCBI Taxonomy resource are used, e.g. NCBITaxon:9606 for humans.",
              "search": {
                "database": {
                  "type": "jsonb"
                }
              }
            },
            "individual_age_at_collection": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:common:age_or_age_range",
              "title": "Age schema",
              "description": "An age object describing the age of the individual at the time of collection of biospecimens or phenotypic observations.",
              "type": "object",
              "oneOf": [
                {
                  "$schema": "http://json-schema.org/draft-07/schema#",
                  "$id": "katsu:common:age",
                  "title": "Age schema",
                  "type": "object",
                  "properties": {
                    "age": {
                      "$schema": "http://json-schema.org/draft-07/schema#",
                      "$id": "katsu:common:age_string",
                      "type": "string",
                      "description": "An ISO8601 duration string (e.g. P40Y10M05D for 40 years, 10 months, 5 days) representing an age of a subject.",
                      "help": "Age of a subject."
                    }
                  },
                  "additionalProperties": false,
                  "required": ["age"],
                  "description": "An ISO8601 duration string (e.g. P40Y10M05D for 40 years, 10 months, 5 days) representing an age of a subject.",
                  "help": "An ISO8601 duration string (e.g. P40Y10M05D for 40 years, 10 months, 5 days) representing an age of a subject."
                },
                {
                  "$schema": "http://json-schema.org/draft-07/schema#",
                  "$id": "katsu:common:age_range",
                  "title": "Age range schema",
                  "type": "object",
                  "properties": {
                    "start": {
                      "$schema": "http://json-schema.org/draft-07/schema#",
                      "$id": "katsu:common:age",
                      "title": "Age schema",
                      "type": "object",
                      "properties": {
                        "age": {
                          "$schema": "http://json-schema.org/draft-07/schema#",
                          "$id": "katsu:common:age_string",
                          "type": "string",
                          "description": "An ISO8601 duration string (e.g. P40Y10M05D for 40 years, 10 months, 5 days) representing an age of a subject.",
                          "help": "Age of a subject."
                        }
                      },
                      "additionalProperties": false,
                      "required": ["age"],
                      "description": "An ISO8601 duration string representing the start of the age range bin.",
                      "help": "An ISO8601 duration string representing the start of the age range bin."
                    },
                    "end": {
                      "$schema": "http://json-schema.org/draft-07/schema#",
                      "$id": "katsu:common:age",
                      "title": "Age schema",
                      "type": "object",
                      "properties": {
                        "age": {
                          "$schema": "http://json-schema.org/draft-07/schema#",
                          "$id": "katsu:common:age_string",
                          "type": "string",
                          "description": "An ISO8601 duration string (e.g. P40Y10M05D for 40 years, 10 months, 5 days) representing an age of a subject.",
                          "help": "Age of a subject."
                        }
                      },
                      "additionalProperties": false,
                      "required": ["age"],
                      "description": "An ISO8601 duration string representing the end of the age range bin.",
                      "help": "An ISO8601 duration string representing the end of the age range bin."
                    }
                  },
                  "additionalProperties": false,
                  "required": ["start", "end"],
                  "description": "Age range of a subject (e.g. when a subject's age falls into a bin.)",
                  "help": "Age range of a subject (e.g. when a subject's age falls into a bin.)"
                }
              ]
            },
            "histological_diagnosis": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:common:ontology_class",
              "title": "Ontology class schema",
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "description": "A CURIE-style identifier for an ontology term representing a refinement of the clinical diagnosis. Normal samples could be tagged with NCIT:C38757, representing a negative finding.",
                  "help": "A CURIE-style identifier for an ontology term representing a refinement of the clinical diagnosis. Normal samples could be tagged with NCIT:C38757, representing a negative finding.",
                  "$id": "katsu:common:ontology_class:id",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 0,
                    "type": "multiple"
                  }
                },
                "label": {
                  "type": "string",
                  "description": "A human readable class name for an ontology term representing a refinement of the clinical diagnosis. Normal samples could be tagged with NCIT:C38757, representing a negative finding.",
                  "help": "A human readable class name for an ontology term representing a refinement of the clinical diagnosis. Normal samples could be tagged with NCIT:C38757, representing a negative finding.",
                  "$id": "katsu:common:ontology_class:label",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 1,
                    "type": "multiple"
                  }
                }
              },
              "additionalProperties": false,
              "required": ["id", "label"],
              "description": "An ontology term representing a refinement of the clinical diagnosis. Normal samples could be tagged with NCIT:C38757, representing a negative finding.",
              "help": "An ontology term representing a refinement of the clinical diagnosis. Normal samples could be tagged with NCIT:C38757, representing a negative finding.",
              "search": {
                "database": {
                  "type": "jsonb"
                }
              }
            },
            "tumor_progression": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:common:ontology_class",
              "title": "Ontology class schema",
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "description": "A CURIE-style identifier for an ontology term representing if the specimen is from a primary tumour, a metastasis, or a recurrence. There are multiple ways of representing this using ontology terms, and the terms chosen will have a specific meaning that is application specific.",
                  "help": "A CURIE-style identifier for an ontology term representing if the specimen is from a primary tumour, a metastasis, or a recurrence. There are multiple ways of representing this using ontology terms, and the terms chosen will have a specific meaning that is application specific.",
                  "$id": "katsu:common:ontology_class:id",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 0,
                    "type": "multiple"
                  }
                },
                "label": {
                  "type": "string",
                  "description": "A human readable class name for an ontology term representing if the specimen is from a primary tumour, a metastasis, or a recurrence. There are multiple ways of representing this using ontology terms, and the terms chosen will have a specific meaning that is application specific.",
                  "help": "A human readable class name for an ontology term representing if the specimen is from a primary tumour, a metastasis, or a recurrence. There are multiple ways of representing this using ontology terms, and the terms chosen will have a specific meaning that is application specific.",
                  "$id": "katsu:common:ontology_class:label",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 1,
                    "type": "multiple"
                  }
                }
              },
              "additionalProperties": false,
              "required": ["id", "label"],
              "description": "An ontology term representing if the specimen is from a primary tumour, a metastasis, or a recurrence. There are multiple ways of representing this using ontology terms, and the terms chosen will have a specific meaning that is application specific.",
              "help": "An ontology term representing if the specimen is from a primary tumour, a metastasis, or a recurrence. There are multiple ways of representing this using ontology terms, and the terms chosen will have a specific meaning that is application specific.",
              "search": {
                "database": {
                  "type": "jsonb"
                }
              }
            },
            "tumor_grade": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:common:ontology_class",
              "title": "Ontology class schema",
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "description": "A CURIE-style identifier for an ontology term representing the tumour grade. This should be a child term of NCIT:C28076 (Disease Grade Qualifier) or equivalent.",
                  "help": "A CURIE-style identifier for an ontology term representing the tumour grade. This should be a child term of NCIT:C28076 (Disease Grade Qualifier) or equivalent.",
                  "$id": "katsu:common:ontology_class:id",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 0,
                    "type": "multiple"
                  }
                },
                "label": {
                  "type": "string",
                  "description": "A human readable class name for an ontology term representing the tumour grade. This should be a child term of NCIT:C28076 (Disease Grade Qualifier) or equivalent.",
                  "help": "A human readable class name for an ontology term representing the tumour grade. This should be a child term of NCIT:C28076 (Disease Grade Qualifier) or equivalent.",
                  "$id": "katsu:common:ontology_class:label",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 1,
                    "type": "multiple"
                  }
                }
              },
              "additionalProperties": false,
              "required": ["id", "label"],
              "description": "An ontology term representing the tumour grade. This should be a child term of NCIT:C28076 (Disease Grade Qualifier) or equivalent.",
              "help": "An ontology term representing the tumour grade. This should be a child term of NCIT:C28076 (Disease Grade Qualifier) or equivalent.",
              "search": {
                "database": {
                  "type": "jsonb"
                }
              }
            },
            "diagnostic_markers": {
              "type": "array",
              "items": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "katsu:common:ontology_class",
                "title": "Ontology class schema",
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "description": "A CURIE-style identifier for an ontology term representing a clinically-relevant bio-marker. Most of the assays, such as immunohistochemistry (IHC), are covered by the NCIT ontology under the sub-hierarchy NCIT:C25294 (Laboratory Procedure), e.g. NCIT:C68748 (HER2/Neu Positive), or NCIT:C131711 Human Papillomavirus-18 Positive).",
                    "help": "A CURIE-style identifier for an ontology term representing a clinically-relevant bio-marker. Most of the assays, such as immunohistochemistry (IHC), are covered by the NCIT ontology under the sub-hierarchy NCIT:C25294 (Laboratory Procedure), e.g. NCIT:C68748 (HER2/Neu Positive), or NCIT:C131711 Human Papillomavirus-18 Positive).",
                    "$id": "katsu:common:ontology_class:id",
                    "search": {
                      "operations": ["eq", "ico", "in"],
                      "queryable": "all",
                      "canNegate": true,
                      "required": false,
                      "order": 0,
                      "type": "multiple"
                    }
                  },
                  "label": {
                    "type": "string",
                    "description": "A human readable class name for an ontology term representing a clinically-relevant bio-marker. Most of the assays, such as immunohistochemistry (IHC), are covered by the NCIT ontology under the sub-hierarchy NCIT:C25294 (Laboratory Procedure), e.g. NCIT:C68748 (HER2/Neu Positive), or NCIT:C131711 Human Papillomavirus-18 Positive).",
                    "help": "A human readable class name for an ontology term representing a clinically-relevant bio-marker. Most of the assays, such as immunohistochemistry (IHC), are covered by the NCIT ontology under the sub-hierarchy NCIT:C25294 (Laboratory Procedure), e.g. NCIT:C68748 (HER2/Neu Positive), or NCIT:C131711 Human Papillomavirus-18 Positive).",
                    "$id": "katsu:common:ontology_class:label",
                    "search": {
                      "operations": ["eq", "ico", "in"],
                      "queryable": "all",
                      "canNegate": true,
                      "required": false,
                      "order": 1,
                      "type": "multiple"
                    }
                  }
                },
                "additionalProperties": false,
                "required": ["id", "label"],
                "description": "An ontology term representing a clinically-relevant bio-marker. Most of the assays, such as immunohistochemistry (IHC), are covered by the NCIT ontology under the sub-hierarchy NCIT:C25294 (Laboratory Procedure), e.g. NCIT:C68748 (HER2/Neu Positive), or NCIT:C131711 Human Papillomavirus-18 Positive).",
                "help": "An ontology term representing a clinically-relevant bio-marker. Most of the assays, such as immunohistochemistry (IHC), are covered by the NCIT ontology under the sub-hierarchy NCIT:C25294 (Laboratory Procedure), e.g. NCIT:C68748 (HER2/Neu Positive), or NCIT:C131711 Human Papillomavirus-18 Positive).",
                "search": {
                  "database": {
                    "type": "jsonb"
                  }
                }
              },
              "description": "A list of ontology terms representing clinically-relevant bio-markers.",
              "help": "A list of ontology terms representing clinically-relevant bio-markers.",
              "$id": "katsu:phenopackets:biosample:diagnostic_markers",
              "search": {
                "database": {
                  "type": "array"
                }
              }
            },
            "procedure": {
              "type": "object",
              "properties": {
                "code": {
                  "$schema": "http://json-schema.org/draft-07/schema#",
                  "$id": "katsu:common:ontology_class",
                  "title": "Ontology class schema",
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "description": "A CURIE-style identifier for an ontology term that represents a clinical procedure performed on a subject.",
                      "help": "A CURIE-style identifier for an ontology term that represents a clinical procedure performed on a subject.",
                      "$id": "katsu:common:ontology_class:id",
                      "search": {
                        "operations": ["eq", "ico", "in"],
                        "queryable": "all",
                        "canNegate": true,
                        "required": false,
                        "order": 0,
                        "type": "multiple"
                      }
                    },
                    "label": {
                      "type": "string",
                      "description": "A human readable class name for an ontology term that represents a clinical procedure performed on a subject.",
                      "help": "A human readable class name for an ontology term that represents a clinical procedure performed on a subject.",
                      "$id": "katsu:common:ontology_class:label",
                      "search": {
                        "operations": ["eq", "ico", "in"],
                        "queryable": "all",
                        "canNegate": true,
                        "required": false,
                        "order": 1,
                        "type": "multiple"
                      }
                    }
                  },
                  "additionalProperties": false,
                  "required": ["id", "label"],
                  "description": "An ontology term that represents a clinical procedure performed on a subject.",
                  "help": "An ontology term that represents a clinical procedure performed on a subject.",
                  "search": {
                    "database": {
                      "type": "jsonb"
                    }
                  }
                },
                "body_site": {
                  "$schema": "http://json-schema.org/draft-07/schema#",
                  "$id": "katsu:common:ontology_class",
                  "title": "Ontology class schema",
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "description": "A CURIE-style identifier for an ontology term that is specified when it is not possible to represent the procedure with a single ontology class.",
                      "help": "A CURIE-style identifier for an ontology term that is specified when it is not possible to represent the procedure with a single ontology class.",
                      "$id": "katsu:common:ontology_class:id",
                      "search": {
                        "operations": ["eq", "ico", "in"],
                        "queryable": "all",
                        "canNegate": true,
                        "required": false,
                        "order": 0,
                        "type": "multiple"
                      }
                    },
                    "label": {
                      "type": "string",
                      "description": "A human readable class name for an ontology term that is specified when it is not possible to represent the procedure with a single ontology class.",
                      "help": "A human readable class name for an ontology term that is specified when it is not possible to represent the procedure with a single ontology class.",
                      "$id": "katsu:common:ontology_class:label",
                      "search": {
                        "operations": ["eq", "ico", "in"],
                        "queryable": "all",
                        "canNegate": true,
                        "required": false,
                        "order": 1,
                        "type": "multiple"
                      }
                    }
                  },
                  "additionalProperties": false,
                  "required": ["id", "label"],
                  "description": "An ontology term that is specified when it is not possible to represent the procedure with a single ontology class.",
                  "help": "An ontology term that is specified when it is not possible to represent the procedure with a single ontology class.",
                  "search": {
                    "database": {
                      "type": "jsonb"
                    }
                  }
                }
              },
              "required": ["code"],
              "description": "A description of a clinical procedure performed on a subject in order to extract a biosample.",
              "help": "A description of a clinical procedure performed on a subject in order to extract a biosample.",
              "$id": "katsu:phenopackets:biosample:procedure",
              "search": {
                "database": {
                  "primary_key": "id",
                  "relation": "phenopackets_procedure",
                  "relationship": {
                    "type": "MANY_TO_ONE",
                    "foreign_key": "procedure_id"
                  }
                }
              }
            },
            "hts_files": {
              "type": "array",
              "items": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "katsu:phenopackets:hts_file",
                "type": "object",
                "properties": {
                  "uri": {
                    "type": "string",
                    "description": "A valid URI to the file",
                    "help": "A valid URI to the file",
                    "$id": "katsu:phenopackets:hts_file:uri"
                  },
                  "description": {
                    "type": "string",
                    "description": "Human-readable text describing the file.",
                    "help": "Human-readable text describing the file.",
                    "$id": "katsu:phenopackets:hts_file:description"
                  },
                  "hts_format": {
                    "type": "string",
                    "enum": ["SAM", "BAM", "CRAM", "VCF", "BCF", "GVCF", "FASTQ", "UNKNOWN"],
                    "description": "The file's format; one of SAM, BAM, CRAM, VCF, BCF, GVCF, FASTQ, or UNKNOWN.",
                    "help": "The file's format; one of SAM, BAM, CRAM, VCF, BCF, GVCF, FASTQ, or UNKNOWN.",
                    "$id": "katsu:phenopackets:hts_file:hts_format"
                  },
                  "genome_assembly": {
                    "type": "string",
                    "description": "Genome assembly ID for the file, e.g. GRCh38.",
                    "help": "Genome assembly ID for the file, e.g. GRCh38.",
                    "$id": "katsu:phenopackets:hts_file:genome_assembly"
                  },
                  "individual_to_sample_identifiers": {
                    "type": "object",
                    "description": "Mapping between individual or biosample IDs and the sample identifier in the HTS file.",
                    "help": "Mapping between individual or biosample IDs and the sample identifier in the HTS file.",
                    "$id": "katsu:phenopackets:hts_file:individual_to_sample_identifiers"
                  },
                  "extra_properties": {
                    "$schema": "http://json-schema.org/draft-07/schema#",
                    "$id": "katsu:common:extra_properties",
                    "type": "object",
                    "help": "Extra properties that are not supported by current schema."
                  }
                },
                "description": "A link to a High-Throughput Sequencing (HTS) data file.",
                "help": "A link to a High-Throughput Sequencing (HTS) data file."
              },
              "description": "A list of HTS files derived from the biosample.",
              "help": "A list of HTS files derived from the biosample.",
              "$id": "katsu:phenopackets:biosample:hts_files"
            },
            "variants": {
              "type": "array",
              "items": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "katsu:phenopackets:variant",
                "type": "object",
                "properties": {
                  "allele": {
                    "$schema": "http://json-schema.org/draft-07/schema#",
                    "$id": "katsu:phenopackets:allele",
                    "title": "Allele schema",
                    "description": "The variant's corresponding allele",
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "description": "An arbitrary identifier.",
                        "help": "An arbitrary identifier.",
                        "$id": "katsu:phenopackets:allele:id"
                      },
                      "hgvs": {
                        "type": "string",
                        "description": "",
                        "help": "",
                        "$id": "katsu:phenopackets:allele:hgvs"
                      },
                      "genome_assembly": {
                        "type": "string",
                        "description": "The reference genome identifier e.g. GRCh38.",
                        "help": "The reference genome identifier e.g. GRCh38.",
                        "$id": "katsu:phenopackets:allele:genome_assembly"
                      },
                      "chr": {
                        "type": "string",
                        "description": "A chromosome identifier e.g. chr2 or 2.",
                        "help": "A chromosome identifier e.g. chr2 or 2.",
                        "$id": "katsu:phenopackets:allele:chr"
                      },
                      "pos": {
                        "type": "integer",
                        "description": "The 1-based genomic position e.g. 134327882.",
                        "help": "The 1-based genomic position e.g. 134327882.",
                        "$id": "katsu:phenopackets:allele:pos"
                      },
                      "ref": {
                        "type": "string",
                        "description": "The reference base(s).",
                        "help": "The reference base(s).",
                        "$id": "katsu:phenopackets:allele:ref"
                      },
                      "alt": {
                        "type": "string",
                        "description": "The alternate base(s).",
                        "help": "The alternate base(s).",
                        "$id": "katsu:phenopackets:allele:alt"
                      },
                      "info": {
                        "type": "string",
                        "description": "Relevant parts of the INFO field.",
                        "help": "Relevant parts of the INFO field.",
                        "$id": "katsu:phenopackets:allele:info"
                      },
                      "seq_id": {
                        "type": "string",
                        "description": "Sequence ID, e.g. Seq1.",
                        "help": "Sequence ID, e.g. Seq1.",
                        "$id": "katsu:phenopackets:allele:seq_id"
                      },
                      "position": {
                        "type": "integer",
                        "description": "Position , a 0-based coordinate for where the Deleted Sequence starts, e.g. 4.",
                        "help": "Position , a 0-based coordinate for where the Deleted Sequence starts, e.g. 4.",
                        "$id": "katsu:phenopackets:allele:position"
                      },
                      "deleted_sequence": {
                        "type": "string",
                        "description": "Deleted sequence , sequence for the deletion, can be empty, e.g. A",
                        "help": "Deleted sequence , sequence for the deletion, can be empty, e.g. A",
                        "$id": "katsu:phenopackets:allele:deleted_sequence"
                      },
                      "inserted_sequence": {
                        "type": "string",
                        "description": "Inserted sequence , sequence for the insertion, can be empty, e.g. G",
                        "help": "Inserted sequence , sequence for the insertion, can be empty, e.g. G",
                        "$id": "katsu:phenopackets:allele:inserted_sequence"
                      },
                      "iscn": {
                        "type": "string",
                        "description": "E.g. t(8;9;11)(q12;p24;p12).",
                        "help": "E.g. t(8;9;11)(q12;p24;p12).",
                        "$id": "katsu:phenopackets:allele:iscn"
                      }
                    },
                    "additionalProperties": false,
                    "oneOf": [
                      {
                        "required": ["hgvs"]
                      },
                      {
                        "required": ["genome_assembly"]
                      },
                      {
                        "required": ["seq_id"]
                      },
                      {
                        "required": ["iscn"]
                      }
                    ],
                    "dependencies": {
                      "genome_assembly": ["chr", "pos", "ref", "alt", "info"],
                      "seq_id": ["position", "deleted_sequence", "inserted_sequence"]
                    },
                    "help": "The variant's corresponding allele",
                    "search": {}
                  },
                  "zygosity": {
                    "$schema": "http://json-schema.org/draft-07/schema#",
                    "$id": "katsu:common:ontology_class",
                    "title": "Ontology class schema",
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "description": "A CURIE-style identifier for an ontology term taken from the Genotype Ontology (GENO) representing the zygosity of the variant.",
                        "help": "A CURIE-style identifier for an ontology term taken from the Genotype Ontology (GENO) representing the zygosity of the variant.",
                        "$id": "katsu:common:ontology_class:id",
                        "search": {
                          "operations": ["eq", "ico", "in"],
                          "queryable": "all",
                          "canNegate": true,
                          "required": false,
                          "order": 0,
                          "type": "multiple"
                        }
                      },
                      "label": {
                        "type": "string",
                        "description": "A human readable class name for an ontology term taken from the Genotype Ontology (GENO) representing the zygosity of the variant.",
                        "help": "A human readable class name for an ontology term taken from the Genotype Ontology (GENO) representing the zygosity of the variant.",
                        "$id": "katsu:common:ontology_class:label",
                        "search": {
                          "operations": ["eq", "ico", "in"],
                          "queryable": "all",
                          "canNegate": true,
                          "required": false,
                          "order": 1,
                          "type": "multiple"
                        }
                      }
                    },
                    "additionalProperties": false,
                    "required": ["id", "label"],
                    "description": "An ontology term taken from the Genotype Ontology (GENO) representing the zygosity of the variant.",
                    "help": "An ontology term taken from the Genotype Ontology (GENO) representing the zygosity of the variant.",
                    "search": {
                      "database": {
                        "type": "jsonb"
                      }
                    }
                  },
                  "extra_properties": {
                    "$schema": "http://json-schema.org/draft-07/schema#",
                    "$id": "katsu:common:extra_properties",
                    "type": "object",
                    "help": "Extra properties that are not supported by current schema."
                  }
                },
                "description": "A representation used to describe candidate or diagnosed causative variants.",
                "help": "A representation used to describe candidate or diagnosed causative variants."
              },
              "description": "A list of variants determined to be present in the biosample.",
              "help": "A list of variants determined to be present in the biosample.",
              "$id": "katsu:phenopackets:biosample:variants"
            },
            "is_control_sample": {
              "type": "boolean",
              "description": "Whether the sample is being used as a normal control.",
              "help": "Whether the sample is being used as a normal control.",
              "$id": "katsu:phenopackets:biosample:is_control_sample",
              "search": {
                "operations": ["eq", "in"],
                "queryable": "all",
                "canNegate": true,
                "required": false,
                "order": 1,
                "type": "single"
              }
            },
            "extra_properties": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:common:extra_properties",
              "type": "object",
              "help": "Extra properties that are not supported by current schema."
            }
          },
          "required": ["id", "sampled_tissue", "procedure"],
          "description": "A unit of biological material from which the substrate molecules (e.g. genomic DNA, RNA, proteins) for molecular analyses are extracted, e.g. a tissue biopsy. Biosamples may be shared among several technical replicates or types of experiments.",
          "help": "A unit of biological material from which the substrate molecules (e.g. genomic DNA, RNA, proteins) for molecular analyses are extracted, e.g. a tissue biopsy. Biosamples may be shared among several technical replicates or types of experiments.",
          "search": {
            "database": {
              "primary_key": "id",
              "relation": "phenopackets_biosample",
              "relationship": {
                "type": "MANY_TO_ONE",
                "foreign_key": "biosample_id"
              }
            }
          }
        },
        "description": "Samples (e.g. biopsies) taken from the individual, if any.",
        "help": "Samples (e.g. biopsies) taken from the individual, if any.",
        "$id": "katsu:phenopackets:phenopacket:biosamples",
        "search": {
          "database": {
            "relation": "phenopackets_phenopacket_biosamples",
            "relationship": {
              "type": "ONE_TO_MANY",
              "parent_foreign_key": "phenopacket_id",
              "parent_primary_key": "id"
            }
          }
        }
      },
      "genes": {
        "type": "array",
        "items": {
          "$schema": "http://json-schema.org/draft-07/schema#",
          "$id": "katsu:phenopackets:gene",
          "type": "object",
          "properties": {
            "id": {
              "type": "string",
              "description": "Official identifier of the gene. It SHOULD be a CURIE identifier with a prefix used by the official organism gene nomenclature committee, e.g. HGNC:347 for humans.",
              "help": "Official identifier of the gene. It SHOULD be a CURIE identifier with a prefix used by the official organism gene nomenclature committee, e.g. HGNC:347 for humans.",
              "$id": "katsu:phenopackets:gene:id",
              "search": {
                "operations": ["eq", "ico", "in"],
                "queryable": "all",
                "canNegate": true,
                "required": false,
                "order": 0,
                "type": "single"
              }
            },
            "alternate_ids": {
              "type": "array",
              "items": {
                "type": "string",
                "description": "An alternative identifier from a resource where the gene is used or catalogued.",
                "help": "An alternative identifier from a resource where the gene is used or catalogued.",
                "$id": "katsu:phenopackets:gene:alternate_ids:item",
                "search": {
                  "operations": ["eq", "ico", "in"],
                  "queryable": "all",
                  "canNegate": true,
                  "required": false,
                  "order": 1,
                  "type": "single"
                }
              },
              "description": "A list of identifiers for alternative resources where the gene is used or catalogued.",
              "help": "A list of identifiers for alternative resources where the gene is used or catalogued.",
              "$id": "katsu:phenopackets:gene:alternate_ids"
            },
            "symbol": {
              "type": "string",
              "description": "A gene's official gene symbol as designated by the organism's gene nomenclature committee, e.g. ETF1 from the HUGO Gene Nomenclature committee.",
              "help": "A gene's official gene symbol as designated by the organism's gene nomenclature committee, e.g. ETF1 from the HUGO Gene Nomenclature committee.",
              "$id": "katsu:phenopackets:gene:symbol",
              "search": {
                "operations": ["eq", "ico", "in"],
                "queryable": "all",
                "canNegate": true,
                "required": false,
                "order": 2,
                "type": "single"
              }
            },
            "extra_properties": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:common:extra_properties",
              "type": "object",
              "help": "Extra properties that are not supported by current schema."
            }
          },
          "required": ["id", "symbol"],
          "description": "A representation of an identifier for a gene.",
          "help": "A representation of an identifier for a gene.",
          "search": {
            "database": {
              "relation": "phenopackets_gene",
              "primary_key": "id",
              "relationship": {
                "type": "MANY_TO_ONE",
                "foreign_key": "gene_id"
              }
            }
          }
        },
        "description": "Genes deemed to be relevant to the case; application-specific.",
        "help": "Genes deemed to be relevant to the case; application-specific.",
        "$id": "katsu:phenopackets:phenopacket:genes",
        "search": {
          "database": {
            "relation": "phenopackets_phenopacket_genes",
            "relationship": {
              "type": "ONE_TO_MANY",
              "parent_foreign_key": "phenopacket_id",
              "parent_primary_key": "id"
            }
          }
        }
      },
      "variants": {
        "type": "array",
        "items": {
          "$schema": "http://json-schema.org/draft-07/schema#",
          "$id": "katsu:phenopackets:variant",
          "type": "object",
          "properties": {
            "allele": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:phenopackets:allele",
              "title": "Allele schema",
              "description": "The variant's corresponding allele",
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "description": "An arbitrary identifier.",
                  "help": "An arbitrary identifier.",
                  "$id": "katsu:phenopackets:allele:id"
                },
                "hgvs": {
                  "type": "string",
                  "description": "",
                  "help": "",
                  "$id": "katsu:phenopackets:allele:hgvs"
                },
                "genome_assembly": {
                  "type": "string",
                  "description": "The reference genome identifier e.g. GRCh38.",
                  "help": "The reference genome identifier e.g. GRCh38.",
                  "$id": "katsu:phenopackets:allele:genome_assembly"
                },
                "chr": {
                  "type": "string",
                  "description": "A chromosome identifier e.g. chr2 or 2.",
                  "help": "A chromosome identifier e.g. chr2 or 2.",
                  "$id": "katsu:phenopackets:allele:chr"
                },
                "pos": {
                  "type": "integer",
                  "description": "The 1-based genomic position e.g. 134327882.",
                  "help": "The 1-based genomic position e.g. 134327882.",
                  "$id": "katsu:phenopackets:allele:pos"
                },
                "ref": {
                  "type": "string",
                  "description": "The reference base(s).",
                  "help": "The reference base(s).",
                  "$id": "katsu:phenopackets:allele:ref"
                },
                "alt": {
                  "type": "string",
                  "description": "The alternate base(s).",
                  "help": "The alternate base(s).",
                  "$id": "katsu:phenopackets:allele:alt"
                },
                "info": {
                  "type": "string",
                  "description": "Relevant parts of the INFO field.",
                  "help": "Relevant parts of the INFO field.",
                  "$id": "katsu:phenopackets:allele:info"
                },
                "seq_id": {
                  "type": "string",
                  "description": "Sequence ID, e.g. Seq1.",
                  "help": "Sequence ID, e.g. Seq1.",
                  "$id": "katsu:phenopackets:allele:seq_id"
                },
                "position": {
                  "type": "integer",
                  "description": "Position , a 0-based coordinate for where the Deleted Sequence starts, e.g. 4.",
                  "help": "Position , a 0-based coordinate for where the Deleted Sequence starts, e.g. 4.",
                  "$id": "katsu:phenopackets:allele:position"
                },
                "deleted_sequence": {
                  "type": "string",
                  "description": "Deleted sequence , sequence for the deletion, can be empty, e.g. A",
                  "help": "Deleted sequence , sequence for the deletion, can be empty, e.g. A",
                  "$id": "katsu:phenopackets:allele:deleted_sequence"
                },
                "inserted_sequence": {
                  "type": "string",
                  "description": "Inserted sequence , sequence for the insertion, can be empty, e.g. G",
                  "help": "Inserted sequence , sequence for the insertion, can be empty, e.g. G",
                  "$id": "katsu:phenopackets:allele:inserted_sequence"
                },
                "iscn": {
                  "type": "string",
                  "description": "E.g. t(8;9;11)(q12;p24;p12).",
                  "help": "E.g. t(8;9;11)(q12;p24;p12).",
                  "$id": "katsu:phenopackets:allele:iscn"
                }
              },
              "additionalProperties": false,
              "oneOf": [
                {
                  "required": ["hgvs"]
                },
                {
                  "required": ["genome_assembly"]
                },
                {
                  "required": ["seq_id"]
                },
                {
                  "required": ["iscn"]
                }
              ],
              "dependencies": {
                "genome_assembly": ["chr", "pos", "ref", "alt", "info"],
                "seq_id": ["position", "deleted_sequence", "inserted_sequence"]
              },
              "help": "The variant's corresponding allele",
              "search": {}
            },
            "zygosity": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:common:ontology_class",
              "title": "Ontology class schema",
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "description": "A CURIE-style identifier for an ontology term taken from the Genotype Ontology (GENO) representing the zygosity of the variant.",
                  "help": "A CURIE-style identifier for an ontology term taken from the Genotype Ontology (GENO) representing the zygosity of the variant.",
                  "$id": "katsu:common:ontology_class:id",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 0,
                    "type": "multiple"
                  }
                },
                "label": {
                  "type": "string",
                  "description": "A human readable class name for an ontology term taken from the Genotype Ontology (GENO) representing the zygosity of the variant.",
                  "help": "A human readable class name for an ontology term taken from the Genotype Ontology (GENO) representing the zygosity of the variant.",
                  "$id": "katsu:common:ontology_class:label",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 1,
                    "type": "multiple"
                  }
                }
              },
              "additionalProperties": false,
              "required": ["id", "label"],
              "description": "An ontology term taken from the Genotype Ontology (GENO) representing the zygosity of the variant.",
              "help": "An ontology term taken from the Genotype Ontology (GENO) representing the zygosity of the variant.",
              "search": {
                "database": {
                  "type": "jsonb"
                }
              }
            },
            "extra_properties": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:common:extra_properties",
              "type": "object",
              "help": "Extra properties that are not supported by current schema."
            }
          },
          "description": "A representation used to describe candidate or diagnosed causative variants.",
          "help": "A representation used to describe candidate or diagnosed causative variants."
        },
        "description": "A list of variants identified in the proband.",
        "help": "A list of variants identified in the proband.",
        "$id": "katsu:phenopackets:phenopacket:variants"
      },
      "diseases": {
        "type": "array",
        "items": {
          "$schema": "http://json-schema.org/draft-07/schema#",
          "$id": "katsu:phenopackets:disease",
          "title": "Disease schema",
          "type": "object",
          "properties": {
            "term": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:common:ontology_class",
              "title": "Ontology class schema",
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "description": "A CURIE-style identifier for an ontology term that represents the disease. It's recommended that one of the OMIM, Orphanet, or MONDO ontologies is used for rare human diseases.",
                  "help": "A CURIE-style identifier for an ontology term that represents the disease. It's recommended that one of the OMIM, Orphanet, or MONDO ontologies is used for rare human diseases.",
                  "$id": "katsu:common:ontology_class:id",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 0,
                    "type": "multiple"
                  }
                },
                "label": {
                  "type": "string",
                  "description": "A human readable class name for an ontology term that represents the disease. It's recommended that one of the OMIM, Orphanet, or MONDO ontologies is used for rare human diseases.",
                  "help": "A human readable class name for an ontology term that represents the disease. It's recommended that one of the OMIM, Orphanet, or MONDO ontologies is used for rare human diseases.",
                  "$id": "katsu:common:ontology_class:label",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 1,
                    "type": "multiple"
                  }
                }
              },
              "additionalProperties": false,
              "required": ["id", "label"],
              "description": "An ontology term that represents the disease. It's recommended that one of the OMIM, Orphanet, or MONDO ontologies is used for rare human diseases.",
              "help": "An ontology term that represents the disease. It's recommended that one of the OMIM, Orphanet, or MONDO ontologies is used for rare human diseases.",
              "search": {
                "database": {
                  "type": "jsonb"
                }
              }
            },
            "onset": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:phenopackets:disease_onset",
              "title": "Onset age",
              "description": "A representation of the age of onset of the disease",
              "type": "object",
              "anyOf": [
                {
                  "$schema": "http://json-schema.org/draft-07/schema#",
                  "$id": "katsu:common:age",
                  "title": "Age schema",
                  "type": "object",
                  "properties": {
                    "age": {
                      "$schema": "http://json-schema.org/draft-07/schema#",
                      "$id": "katsu:common:age_string",
                      "type": "string",
                      "description": "An ISO8601 duration string (e.g. P40Y10M05D for 40 years, 10 months, 5 days) representing an age of a subject.",
                      "help": "Age of a subject."
                    }
                  },
                  "additionalProperties": false,
                  "required": ["age"],
                  "description": "An ISO8601 duration string (e.g. P40Y10M05D for 40 years, 10 months, 5 days) representing an age of a subject.",
                  "help": "An ISO8601 duration string (e.g. P40Y10M05D for 40 years, 10 months, 5 days) representing an age of a subject."
                },
                {
                  "$schema": "http://json-schema.org/draft-07/schema#",
                  "$id": "katsu:common:age_range",
                  "title": "Age range schema",
                  "type": "object",
                  "properties": {
                    "start": {
                      "$schema": "http://json-schema.org/draft-07/schema#",
                      "$id": "katsu:common:age",
                      "title": "Age schema",
                      "type": "object",
                      "properties": {
                        "age": {
                          "$schema": "http://json-schema.org/draft-07/schema#",
                          "$id": "katsu:common:age_string",
                          "type": "string",
                          "description": "An ISO8601 duration string (e.g. P40Y10M05D for 40 years, 10 months, 5 days) representing an age of a subject.",
                          "help": "Age of a subject."
                        }
                      },
                      "additionalProperties": false,
                      "required": ["age"],
                      "description": "An ISO8601 duration string representing the start of the age range bin.",
                      "help": "An ISO8601 duration string representing the start of the age range bin."
                    },
                    "end": {
                      "$schema": "http://json-schema.org/draft-07/schema#",
                      "$id": "katsu:common:age",
                      "title": "Age schema",
                      "type": "object",
                      "properties": {
                        "age": {
                          "$schema": "http://json-schema.org/draft-07/schema#",
                          "$id": "katsu:common:age_string",
                          "type": "string",
                          "description": "An ISO8601 duration string (e.g. P40Y10M05D for 40 years, 10 months, 5 days) representing an age of a subject.",
                          "help": "Age of a subject."
                        }
                      },
                      "additionalProperties": false,
                      "required": ["age"],
                      "description": "An ISO8601 duration string representing the end of the age range bin.",
                      "help": "An ISO8601 duration string representing the end of the age range bin."
                    }
                  },
                  "additionalProperties": false,
                  "required": ["start", "end"],
                  "description": "Age range of a subject (e.g. when a subject's age falls into a bin.)",
                  "help": "Age range of a subject (e.g. when a subject's age falls into a bin.)"
                },
                {
                  "$schema": "http://json-schema.org/draft-07/schema#",
                  "$id": "katsu:common:ontology_class",
                  "title": "Ontology class schema",
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "description": "A CURIE-style identifier for an ontology term.",
                      "help": "A CURIE-style identifier for an ontology term.",
                      "$id": "katsu:common:ontology_class:id"
                    },
                    "label": {
                      "type": "string",
                      "description": "A human readable class name for an ontology term.",
                      "help": "A human readable class name for an ontology term.",
                      "$id": "katsu:common:ontology_class:label"
                    }
                  },
                  "additionalProperties": false,
                  "required": ["id", "label"],
                  "description": "An ontology term.",
                  "help": "An ontology term."
                }
              ],
              "help": "A representation of the age of onset of the disease"
            },
            "disease_stage": {
              "type": "array",
              "items": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "katsu:common:ontology_class",
                "title": "Ontology class schema",
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "description": "A CURIE-style identifier for an ontology term that represents the disease stage. Terms should be children of NCIT:C28108 (Disease Stage Qualifier) or equivalent hierarchy from another ontology.",
                    "help": "A CURIE-style identifier for an ontology term that represents the disease stage. Terms should be children of NCIT:C28108 (Disease Stage Qualifier) or equivalent hierarchy from another ontology.",
                    "$id": "katsu:common:ontology_class:id",
                    "search": {
                      "operations": ["eq", "ico", "in"],
                      "queryable": "all",
                      "canNegate": true,
                      "required": false,
                      "order": 0,
                      "type": "multiple"
                    }
                  },
                  "label": {
                    "type": "string",
                    "description": "A human readable class name for an ontology term that represents the disease stage. Terms should be children of NCIT:C28108 (Disease Stage Qualifier) or equivalent hierarchy from another ontology.",
                    "help": "A human readable class name for an ontology term that represents the disease stage. Terms should be children of NCIT:C28108 (Disease Stage Qualifier) or equivalent hierarchy from another ontology.",
                    "$id": "katsu:common:ontology_class:label",
                    "search": {
                      "operations": ["eq", "ico", "in"],
                      "queryable": "all",
                      "canNegate": true,
                      "required": false,
                      "order": 1,
                      "type": "multiple"
                    }
                  }
                },
                "additionalProperties": false,
                "required": ["id", "label"],
                "description": "An ontology term that represents the disease stage. Terms should be children of NCIT:C28108 (Disease Stage Qualifier) or equivalent hierarchy from another ontology.",
                "help": "An ontology term that represents the disease stage. Terms should be children of NCIT:C28108 (Disease Stage Qualifier) or equivalent hierarchy from another ontology.",
                "search": {
                  "database": {
                    "type": "jsonb"
                  }
                }
              },
              "description": "A list of terms representing the disease stage. Elements should be derived from child terms of NCIT:C28108 (Disease Stage Qualifier) or equivalent hierarchy from another ontology.",
              "help": "A list of terms representing the disease stage. Elements should be derived from child terms of NCIT:C28108 (Disease Stage Qualifier) or equivalent hierarchy from another ontology.",
              "$id": "katsu:phenopackets:disease:disease_stage",
              "search": {
                "database": {
                  "type": "array"
                }
              }
            },
            "tnm_finding": {
              "type": "array",
              "items": {
                "$schema": "http://json-schema.org/draft-07/schema#",
                "$id": "katsu:common:ontology_class",
                "title": "Ontology class schema",
                "type": "object",
                "properties": {
                  "id": {
                    "type": "string",
                    "description": "A CURIE-style identifier for an ontology term that represents the TNM score. Terms should be children of NCIT:C48232 (Cancer TNM Finding) or equivalent hierarchy from another ontology.",
                    "help": "A CURIE-style identifier for an ontology term that represents the TNM score. Terms should be children of NCIT:C48232 (Cancer TNM Finding) or equivalent hierarchy from another ontology.",
                    "$id": "katsu:common:ontology_class:id",
                    "search": {
                      "operations": ["eq", "ico", "in"],
                      "queryable": "all",
                      "canNegate": true,
                      "required": false,
                      "order": 0,
                      "type": "multiple"
                    }
                  },
                  "label": {
                    "type": "string",
                    "description": "A human readable class name for an ontology term that represents the TNM score. Terms should be children of NCIT:C48232 (Cancer TNM Finding) or equivalent hierarchy from another ontology.",
                    "help": "A human readable class name for an ontology term that represents the TNM score. Terms should be children of NCIT:C48232 (Cancer TNM Finding) or equivalent hierarchy from another ontology.",
                    "$id": "katsu:common:ontology_class:label",
                    "search": {
                      "operations": ["eq", "ico", "in"],
                      "queryable": "all",
                      "canNegate": true,
                      "required": false,
                      "order": 1,
                      "type": "multiple"
                    }
                  }
                },
                "additionalProperties": false,
                "required": ["id", "label"],
                "description": "An ontology term that represents the TNM score. Terms should be children of NCIT:C48232 (Cancer TNM Finding) or equivalent hierarchy from another ontology.",
                "help": "An ontology term that represents the TNM score. Terms should be children of NCIT:C48232 (Cancer TNM Finding) or equivalent hierarchy from another ontology.",
                "search": {
                  "database": {
                    "type": "jsonb"
                  }
                }
              },
              "description": "A list of terms representing the tumour TNM score. Elements should be derived from child terms of NCIT:C48232 (Cancer TNM Finding) or equivalent hierarchy from another ontology.",
              "help": "A list of terms representing the tumour TNM score. Elements should be derived from child terms of NCIT:C48232 (Cancer TNM Finding) or equivalent hierarchy from another ontology.",
              "$id": "katsu:phenopackets:disease:tnm_finding",
              "search": {
                "database": {
                  "type": "array"
                }
              }
            },
            "extra_properties": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:common:extra_properties",
              "type": "object",
              "help": "Extra properties that are not supported by current schema."
            }
          },
          "required": ["term"],
          "description": "A representation of a diagnosis, i.e. an inference or hypothesis about the cause underlying the observed phenotypic abnormalities.",
          "help": "A representation of a diagnosis, i.e. an inference or hypothesis about the cause underlying the observed phenotypic abnormalities.",
          "search": {
            "database": {
              "primary_key": "id",
              "relation": "phenopackets_disease",
              "relationship": {
                "type": "MANY_TO_ONE",
                "foreign_key": "disease_id"
              }
            }
          }
        },
        "description": "A list of diseases diagnosed in the proband.",
        "help": "A list of diseases diagnosed in the proband.",
        "$id": "katsu:phenopackets:phenopacket:diseases",
        "search": {
          "database": {
            "relation": "phenopackets_phenopacket_diseases",
            "relationship": {
              "type": "ONE_TO_MANY",
              "parent_foreign_key": "phenopacket_id",
              "parent_primary_key": "id"
            }
          }
        }
      },
      "hts_files": {
        "type": "array",
        "items": {
          "$schema": "http://json-schema.org/draft-07/schema#",
          "$id": "katsu:phenopackets:hts_file",
          "type": "object",
          "properties": {
            "uri": {
              "type": "string",
              "description": "A valid URI to the file",
              "help": "A valid URI to the file",
              "$id": "katsu:phenopackets:hts_file:uri"
            },
            "description": {
              "type": "string",
              "description": "Human-readable text describing the file.",
              "help": "Human-readable text describing the file.",
              "$id": "katsu:phenopackets:hts_file:description"
            },
            "hts_format": {
              "type": "string",
              "enum": ["SAM", "BAM", "CRAM", "VCF", "BCF", "GVCF", "FASTQ", "UNKNOWN"],
              "description": "The file's format; one of SAM, BAM, CRAM, VCF, BCF, GVCF, FASTQ, or UNKNOWN.",
              "help": "The file's format; one of SAM, BAM, CRAM, VCF, BCF, GVCF, FASTQ, or UNKNOWN.",
              "$id": "katsu:phenopackets:hts_file:hts_format"
            },
            "genome_assembly": {
              "type": "string",
              "description": "Genome assembly ID for the file, e.g. GRCh38.",
              "help": "Genome assembly ID for the file, e.g. GRCh38.",
              "$id": "katsu:phenopackets:hts_file:genome_assembly"
            },
            "individual_to_sample_identifiers": {
              "type": "object",
              "description": "Mapping between individual or biosample IDs and the sample identifier in the HTS file.",
              "help": "Mapping between individual or biosample IDs and the sample identifier in the HTS file.",
              "$id": "katsu:phenopackets:hts_file:individual_to_sample_identifiers"
            },
            "extra_properties": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:common:extra_properties",
              "type": "object",
              "help": "Extra properties that are not supported by current schema."
            }
          },
          "description": "A link to a High-Throughput Sequencing (HTS) data file.",
          "help": "A link to a High-Throughput Sequencing (HTS) data file."
        },
        "description": "A list of HTS files derived from the individual.",
        "help": "A list of HTS files derived from the individual.",
        "$id": "katsu:phenopackets:phenopacket:hts_files"
      },
      "meta_data": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$id": "katsu:phenopackets:meta_data",
        "type": "object",
        "properties": {
          "created": {
            "type": "string",
            "format": "date-time",
            "description": "ISO8601 timestamp specifying when when this object was created.",
            "help": "Timestamp specifying when when this object was created.",
            "$id": "katsu:phenopackets:meta_data:created"
          },
          "created_by": {
            "type": "string",
            "description": "Name of the person who created the phenopacket.",
            "help": "Name of the person who created the phenopacket.",
            "$id": "katsu:phenopackets:meta_data:created_by",
            "search": {
              "operations": ["eq", "ico", "in"],
              "queryable": "all",
              "canNegate": true,
              "required": false,
              "order": 0,
              "type": "multiple"
            }
          },
          "submitted_by": {
            "type": "string",
            "description": "Name of the person who submitted the phenopacket.",
            "help": "Name of the person who submitted the phenopacket.",
            "$id": "katsu:phenopackets:meta_data:submitted_by",
            "search": {
              "operations": ["eq", "ico", "in"],
              "queryable": "all",
              "canNegate": true,
              "required": false,
              "order": 1,
              "type": "multiple"
            }
          },
          "resources": {
            "type": "array",
            "items": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:resources:resource",
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "description": "Unique researcher-specified identifier for the resource.",
                  "help": "For OBO ontologies, the value of this string MUST always be the official OBO ID, which is always equivalent to the ID prefix in lower case. For other resources use the prefix in identifiers.org.",
                  "$id": "katsu:resources:resource:id",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 0,
                    "type": "single"
                  }
                },
                "name": {
                  "type": "string",
                  "description": "Human-readable name for the resource.",
                  "help": "The full name of the resource or ontology referred to by the id element.",
                  "$id": "katsu:resources:resource:name",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 1,
                    "type": "multiple"
                  }
                },
                "namespace_prefix": {
                  "type": "string",
                  "description": "Prefix for objects from this resource. In the case of ontology resources, this should be the CURIE prefix.",
                  "help": "Prefix for objects from this resource. In the case of ontology resources, this should be the CURIE prefix.",
                  "$id": "katsu:resources:resource:namespace_prefix",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 2,
                    "type": "multiple"
                  }
                },
                "url": {
                  "type": "string",
                  "description": "Resource URL. In the case of ontologies, this should be an OBO or OWL file. Other resources should link to the official or top-level url.",
                  "help": "Resource URL. In the case of ontologies, this should be an OBO or OWL file. Other resources should link to the official or top-level url.",
                  "$id": "katsu:resources:resource:url",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 3,
                    "type": "multiple"
                  }
                },
                "version": {
                  "type": "string",
                  "description": "The version of the resource or ontology used to make the annotation.",
                  "help": "The version of the resource or ontology used to make the annotation.",
                  "$id": "katsu:resources:resource:version",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 4,
                    "type": "multiple"
                  }
                },
                "iri_prefix": {
                  "type": "string",
                  "description": "The IRI prefix, when used with the namespace prefix and an object ID, should resolve the term or object from the resource in question.",
                  "help": "The IRI prefix, when used with the namespace prefix and an object ID, should resolve the term or object from the resource in question.",
                  "$id": "katsu:resources:resource:iri_prefix",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 5,
                    "type": "multiple"
                  }
                },
                "extra_properties": {
                  "$schema": "http://json-schema.org/draft-07/schema#",
                  "$id": "katsu:common:extra_properties",
                  "type": "object",
                  "help": "Extra properties that are not supported by current schema."
                }
              },
              "required": ["id", "name", "namespace_prefix", "url", "version", "iri_prefix"],
              "description": "A description of an external resource used for referencing an object.",
              "help": "A description of an external resource used for referencing an object.",
              "search": {
                "database": {
                  "relationship": {
                    "type": "MANY_TO_ONE",
                    "foreign_key": "resource_id"
                  }
                }
              }
            },
            "description": "A list of resources or ontologies referenced in the phenopacket",
            "help": "A list of resources or ontologies referenced in the phenopacket",
            "$id": "katsu:phenopackets:meta_data:resources",
            "search": {
              "database": {
                "relation": "phenopackets_metadata_resources",
                "relationship": {
                  "type": "ONE_TO_MANY",
                  "parent_foreign_key": "metadata_id",
                  "parent_primary_key": "id"
                }
              }
            }
          },
          "updates": {
            "type": "array",
            "items": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:phenopackets:update",
              "title": "Updates schema",
              "type": "object",
              "properties": {
                "timestamp": {
                  "type": "string",
                  "format": "date-time",
                  "description": "ISO8601 UTC timestamp specifying when when this update occurred.",
                  "help": "Timestamp specifying when when this update occurred.",
                  "$id": "katsu:phenopackets:update:timestamp"
                },
                "updated_by": {
                  "type": "string",
                  "description": "Information about the person/organization/network that performed the update.",
                  "help": "Information about the person/organization/network that performed the update.",
                  "$id": "katsu:phenopackets:update:updated_by",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 0,
                    "type": "multiple"
                  }
                },
                "comment": {
                  "type": "string",
                  "description": "Free-text comment about the changes made and/or the reason for the update.",
                  "help": "Free-text comment about the changes made and/or the reason for the update.",
                  "$id": "katsu:phenopackets:update:comment",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 1,
                    "type": "multiple"
                  }
                }
              },
              "additionalProperties": false,
              "required": ["timestamp", "comment"],
              "description": "An update event for a record (e.g. a phenopacket.)",
              "help": "An update event for a record (e.g. a phenopacket.)",
              "search": {
                "database": {
                  "type": "jsonb"
                }
              }
            },
            "description": "A list of updates to the phenopacket.",
            "help": "A list of updates to the phenopacket.",
            "$id": "katsu:phenopackets:meta_data:updates",
            "search": {
              "database": {
                "type": "array"
              }
            }
          },
          "phenopacket_schema_version": {
            "type": "string",
            "description": "Schema version of the current phenopacket.",
            "help": "Schema version of the current phenopacket.",
            "$id": "katsu:phenopackets:meta_data:phenopacket_schema_version"
          },
          "external_references": {
            "type": "array",
            "items": {
              "$schema": "http://json-schema.org/draft-07/schema#",
              "$id": "katsu:phenopackets:external_reference",
              "title": "External reference schema",
              "type": "object",
              "properties": {
                "id": {
                  "type": "string",
                  "description": "An application-specific identifier. It is RECOMMENDED that this is a CURIE that uniquely identifies the evidence source when combined with a resource; e.g. PMID:123456 with a resource `pmid`. It could also be a URI or other relevant identifier.",
                  "help": "An application-specific identifier. It is RECOMMENDED that this is a CURIE that uniquely identifies the evidence source when combined with a resource; e.g. PMID:123456 with a resource `pmid`. It could also be a URI or other relevant identifier.",
                  "$id": "katsu:phenopackets:external_reference:id",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 0,
                    "type": "single"
                  }
                },
                "description": {
                  "type": "string",
                  "description": "An application-specific free-text description.",
                  "help": "An application-specific free-text description.",
                  "$id": "katsu:phenopackets:external_reference:description",
                  "search": {
                    "operations": ["eq", "ico", "in"],
                    "queryable": "all",
                    "canNegate": true,
                    "required": false,
                    "order": 1,
                    "type": "multiple"
                  }
                }
              },
              "required": ["id"],
              "description": "An encoding of information about a reference to an external resource.",
              "help": "An encoding of information about a reference to an external resource.",
              "search": {
                "database": {
                  "type": "jsonb"
                }
              }
            },
            "description": "A list of external (non-resource) references.",
            "help": "A list of external (non-resource) references.",
            "$id": "katsu:phenopackets:meta_data:external_references"
          },
          "extra_properties": {
            "$schema": "http://json-schema.org/draft-07/schema#",
            "$id": "katsu:common:extra_properties",
            "type": "object",
            "help": "Extra properties that are not supported by current schema."
          }
        },
        "description": "A structured definition of the resources and ontologies used within a phenopacket.",
        "help": "A structured definition of the resources and ontologies used within a phenopacket.",
        "search": {
          "database": {
            "relation": "phenopackets_metadata",
            "primary_key": "id"
          }
        }
      },
      "extra_properties": {
        "$schema": "http://json-schema.org/draft-07/schema#",
        "$id": "katsu:common:extra_properties",
        "type": "object",
        "help": "Extra properties that are not supported by current schema."
      }
    },
    "required": ["meta_data"],
    "help": "An anonymous phenotypic description of an individual or biosample with potential genes of interest and/or diagnoses. The concept has multiple use-cases.",
    "search": {
      "database": {
        "relation": "phenopackets_phenopacket",
        "primary_key": "id"
      }
    }
  }
  ]