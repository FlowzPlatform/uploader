<template>
    <div class="pdmedit">
    <!-- {{pdata}} -->
      <!-- <div style="border: 1px solid #eee;">
        <vue-form-generator :schema="schema" :model="model" :options="formOptions" style="padding: 20px;"></vue-form-generator>
      </div> -->
      <!-- <div class="container" id="app">
        <div class="panel panel-default">
          <div class="panel-heading">Form</div>
          <div class="panel-body">
            <vue-form-generator :schema="pschema" :model="pdata" :options="formOptions"></vue-form-generator>
          </div>
        </div>
      </div> -->
      <Row style="float: right">
        <Button type="primary" @click="hanleSubmit">Submit</Button>
        <Button type="ghost" @click="hanleRestore">Restore</Button>
      </Row>
      <div class='row'>
        <div id='editor_holder' class='medium-12 columns'></div>
      </div>
    </div>
</template>

<script>
/* eslint-disable */
import axios from 'axios'
import VueFormGenerator from "vue-form-generator";
import "vue-form-generator/dist/vfg.css";
let editor;
JSONEditor.defaults.theme = 'foundation5';
JSONEditor.defaults.iconlib = 'fontawesome4';
JSONEditor.defaults.layout = 'grid';
// var editor = new JSONEditor(document.getElementById('editor_holder'),{
//   // Enable fetching schemas via ajax
//   ajax: true,
  
//   // The schema for the editor
//   schema: {
//     $ref: "person.json",
//     format: "grid"
//   },
  
//   // Seed the form with a starting value
//   startval: starting_value
// });

//component javascript
// export default{
//   components:{
//     "vue-form-generator": VueFormGenerator.component
//   }
// }
// import _ from 'lodash'

// import VueFormGenerator from "vue-form-generator"
// Vue.use(VueFormGenerator)

export default {
  name: 'pdmedit',
  components: {
    'vue-form-generator': VueFormGenerator.component
  },
  data () {
    return {
      vid: 'b00ef491-d25e-4f50-9327-299bc78e5789',
      pdata: {},
      model: {             
        id: 1,
        name: "John Doe",
        password: "J0hnD03!x4",
        skills: ["Javascript", "VueJS"],
        email: "john.doe@gmail.com",
        status: true
      },
      pschema: {
        fields: [{
          type: "input",
          inputType: "text",
          label: "_id",
          model: "_id",
          readonly: true,         
          disabled: true
        },{
          type: "input",
          inputType: "text",
          label: "Product Name",
          model: "product_name",
          placeholder: "Product Name",
          featured: true,
          required: true
        },{
          type: "input",
          inputType: "text",
          label: "SKU",
          model: "sku",
          // min: 6,
          required: true
          // hint: "Minimum 6 characters",
          // validator: VueFormGenerator.validators.string
        }, {
          type: "input",
          inputType: "text",
          label: "description",
          model: "description",
          placeholder: "description",
          featured: true,
          required: true
        }]
      },
      schema: {
        fields: [{
          type: "input",
          inputType: "text",
          label: "ID (disabled text field)",
          model: "id",
          readonly: true,         
          disabled: true
        },{
          type: "input",
          inputType: "text",
          label: "Name",
          model: "name",
          placeholder: "Your name",
          featured: true,
          required: true
        },{
          type: "input",
          inputType: "password",
          label: "Password",
          model: "password",
          min: 6,
          required: true,
          hint: "Minimum 6 characters",
          validator: VueFormGenerator.validators.string
        },{
          type: "select",
          label: "Skills",
          model: "skills",      
          values: ["Javascript", "VueJS", "CSS3", "HTML5"]
        },{
          type: "input",
          inputType: "email",
          label: "E-mail",
          model: "email",
          placeholder: "User's e-mail address"
        },{
          type: "checkbox",
          label: "Status",
          model: "status",
          default: true
        }]
      },
      formOptions: {
        validateAfterLoad: true,
        validateAfterChanged: true
      },
      starting_value: {
        name: "John Smith",
        age: 35,
        gender: "male",
        location: {
          city: "San Francisco",
          state: "California"
        },
        pets: [
          {
            name: "Spot",
            type: "dog",
            fixed: true
          },
          {
            name: "Whiskers",
            type: "cat",
            fixed: false
          }
        ]
      }
    }
  },
  created() {
    // editor.on('change',function() {
    //   // Get an array of errors from the validator
    //   var errors = editor.validate();
      
    //   var indicator = document.getElementById('valid_indicator');
      
    //   // Not valid
    //   if(errors.length) {
    //     indicator.className = 'label alert';
    //     indicator.textContent = 'not valid';
    //   }
    //   // Valid
    //   else {
    //     indicator.className = 'label success';
    //     indicator.textContent = 'valid';
    //   }
    // });
  },
  methods: {
    async init (id) {
      console.log('calling')
      let url = 'https://api.flowzcluster.tk/pdmnew/pdm?_id=' + id
      this.pdata = await axios.get(url, {
        headers: {
          vid: this.vid
        }
      }).then(res => {
        console.log(res.data.hits.hits[0]._source)
        let pdm = res.data.hits.hits[0]._source
        pdm._id = res.data.hits.hits[0]._id
        return pdm
      }).catch(err => {
        console.log(err)
        return {}
      })
    },
    hanleSubmit () {
      let data = editor.getValue()
      console.log('Value:::::', data)
    },
    hanleRestore () {
       editor.setValue(this.pdata);
    }
  },
  async mounted () {
    await this.init(this.$route.params.id)
    editor = new JSONEditor(document.getElementById('editor_holder'),{
      // Enable fetching schemas via ajax
      ajax: true,
      
      // The schema for the editor
      schema: {
         "product": {
            "title": "Product", 
            "type": "object",
            "additionalProperties": false, 
            "properties": {
               "activeSummary": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "additional_charge": {
                  "type": "nested",
                  "properties": {
                     "charge_name": {
                        "type": "text"
                     },
                     "moq": {
                        "type": "text"
                     },
                     "option_name": {
                        "type": "text"
                     },
                     "price_range": {
                        "type": "nested",
                        "properties": {
                           "net_price": {
                              "type": "double"
                           },
                           "price": {
                              "type": "double"
                           },
                           "qty": {
                              "type": "integer_range"
                           }
                        }
                     }
                  }
               },
               "attr_colors": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "attr_decimal": {
                  "type": "long"
               },
               "attr_imprint_color": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "attr_shape": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "attributes": {
                  "properties": {
                     "colors": {
                        "type": "text",
                        "fields": {
                           "english": {
                              "type": "text",
                              "analyzer": "english"
                           },
                           "raw": {
                              "type": "keyword"
                           }
                        }
                     },
                     "decimal": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "shape": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "size": {
                        "type": "text",
                        "fields": {
                           "raw": {
                              "type": "keyword"
                           }
                        }
                     }
                  }
               },
               "available_currencies": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "available_regions": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "categories": {
                  "type": "text",
                  "fields": {
                     "english": {
                        "type": "text",
                        "analyzer": "english"
                     },
                     "raw": {
                        "type": "keyword"
                     }
                  },
                  "fielddata": true
               },
               "company": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "country": {
                  "type": "text"
               },
               "currency": {
                  "type": "text"
               },
               "default_color": {
                  "type": "text"
               },
               "default_image": {
                  "type": "text"
               },
               "default_image_color_code": {
                  "type": "text"
               },
               "description": {
                  "type": "text",
                  "fields": {
                     "english": {
                        "type": "text",
                        "analyzer": "english"
                     }
                  }
               },
               "distributor_central_url": {
                  "type": "text"
               },
               "feature_10": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_11": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_12": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_13": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_14": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_15": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_16": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_17": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_18": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_19": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_20": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_21": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_22": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_23": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_24": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_25": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_26": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_27": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_28": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_29": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_30": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_31": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_32": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_33": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_34": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_5": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_6": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_7": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_8": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "feature_9": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "features": {
                  "properties": {
                     "key": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "label": {
                        "type": "text"
                     },
                     "value": {
                        "type": "text",
                        "fields": {
                           "english": {
                              "type": "text",
                              "analyzer": "english"
                           }
                        }
                     }
                  }
               },
               "images": {
                  "properties": {
                     "Web_image_3": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "_id": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "color": {
                        "type": "text"
                     },
                     "image_color_code_1": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "image_color_code_10": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "image_color_code_11": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "image_color_code_12": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "image_color_code_13": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "image_color_code_14": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "image_color_code_15": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "image_color_code_16": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "image_color_code_17": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "image_color_code_18": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "image_color_code_2": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "image_color_code_3": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "image_color_code_4": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "image_color_code_5": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "image_color_code_6": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "image_color_code_7": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "image_color_code_8": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "image_color_code_9": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "images": {
                        "properties": {
                           "color": {
                              "type": "text",
                              "fields": {
                                 "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                 }
                              }
                           },
                           "image_color_code": {
                              "type": "text",
                              "fields": {
                                 "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                 }
                              }
                           },
                           "web_image": {
                              "type": "text",
                              "fields": {
                                 "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                 }
                              }
                           }
                        }
                     },
                     "import-tracker_id": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "product_id": {
                        "type": "long"
                     },
                     "sku": {
                        "type": "long"
                     },
                     "web_image": {
                        "type": "text"
                     }
                  }
               },
               "import-tracker_id": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "imprint_data": {
                  "type": "nested",
                  "properties": {
                     "_id": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "additional_color_charge": {
                        "type": "text"
                     },
                     "additional_location_charge": {
                        "type": "text"
                     },
                     "code_1": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "code_10": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "code_2": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "code_3": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "code_4": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "code_5": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "code_6": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "code_7": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "code_8": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "code_9": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "full_color": {
                        "type": "text"
                     },
                     "import-tracker_id": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "imprint_area": {
                        "type": "text"
                     },
                     "imprint_method": {
                        "type": "text"
                     },
                     "imprint_position": {
                        "type": "text"
                     },
                     "is_pms_color_allow": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "location_price_included": {
                        "type": "integer"
                     },
                     "ltm_charge": {
                        "type": "text"
                     },
                     "matrix": {
                        "type": "text"
                     },
                     "max_imprint_color_allowed": {
                        "type": "integer"
                     },
                     "max_location_allowed": {
                        "type": "integer"
                     },
                     "pms_charge": {
                        "type": "text"
                     },
                     "price_1": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "price_10": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "price_2": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "price_3": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "price_4": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "price_5": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "price_6": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "price_7": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "price_8": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "price_9": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "price_included": {
                        "type": "integer"
                     },
                     "price_range": {
                        "type": "nested",
                        "properties": {
                           "price": {
                              "type": "double"
                           },
                           "qty": {
                              "type": "long_range"
                           }
                        }
                     },
                     "product_id": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "production_days": {
                        "type": "text"
                     },
                     "production_unit": {
                        "type": "text"
                     },
                     "qty_10_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_10_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_1_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_1_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_2_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_2_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_3_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_3_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_4_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_4_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_5_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_5_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_6_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_6_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_7_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_7_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_8_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_8_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_9_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_9_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "rush_charge": {
                        "type": "text"
                     },
                     "setup_charge": {
                        "type": "text"
                     },
                     "sku": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "type_of_charge": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     }
                  }
               },
               "is_vmc": {
                  "type": "boolean"
               },
               "language": {
                  "type": "text"
               },
               "linename": {
                  "type": "text",
                  "fields": {
                     "english": {
                        "type": "text",
                        "analyzer": "english"
                     },
                     "raw": {
                        "type": "keyword"
                     }
                  }
               },
               "matrix_frieght": {
                  "type": "double"
               },
               "matrix_price": {
                  "type": "double"
               },
               "max_price": {
                  "type": "float"
               },
               "min_price": {
                  "type": "float"
               },
               "nonavailable_regions": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "packaging_charges": {
                  "type": "double"
               },
               "packaging_code": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "packaging_type": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "price": {
                  "type": "double"
               },
               "price_1": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  },
                  "fielddata": true
               },
               "pricing": {
                  "properties": {
                     "_id": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "code_2": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "code_3": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "code_4": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "code_5": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "code_6": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "code_7": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "code_8": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "currency": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "global_price_type": {
                        "type": "text",
                        "fields": {
                           "english": {
                              "type": "text",
                              "analyzer": "english"
                           },
                           "raw": {
                              "type": "keyword"
                           }
                        }
                     },
                     "import-tracker_id": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "price_2": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "price_3": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "price_4": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "price_5": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "price_6": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "price_7": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "price_8": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "price_range": {
                        "type": "nested",
                        "properties": {
                           "code": {
                              "type": "text",
                              "fields": {
                                 "keyword": {
                                    "type": "keyword",
                                    "ignore_above": 256
                                 }
                              }
                           },
                           "price": {
                              "type": "double"
                           },
                           "qty": {
                              "type": "integer_range"
                           }
                        }
                     },
                     "price_type": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "price_unit": {
                        "type": "text",
                        "fields": {
                           "english": {
                              "type": "text",
                              "analyzer": "english"
                           },
                           "raw": {
                              "type": "keyword"
                           }
                        }
                     },
                     "product_id": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_2_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_2_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_3_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_3_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_4_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_4_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_5_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_5_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_6_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_6_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_7_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_7_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_8_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_8_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "sku": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "type": {
                        "type": "text",
                        "fields": {
                           "english": {
                              "type": "text",
                              "analyzer": "english"
                           },
                           "raw": {
                              "type": "keyword"
                           }
                        }
                     }
                  }
               },
               "private": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "product_id": {
                  "type": "long"
               },
               "product_name": {
                  "type": "text",
                  "similarity": "BM25"
               },
               "search_keyword": {
                  "type": "text",
                  "fields": {
                     "english": {
                        "type": "text",
                        "analyzer": "english"
                     },
                     "raw": {
                        "type": "text",
                        "analyzer": "keyword_lowercase_analyzer"
                     }
                  }
               },
               "shipping": {
                  "properties": {
                     "_id": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "carton_height": {
                        "type": "text"
                     },
                     "carton_length": {
                        "type": "double"
                     },
                     "carton_size_unit": {
                        "type": "text"
                     },
                     "carton_weight": {
                        "type": "text"
                     },
                     "carton_weight_unit": {
                        "type": "text"
                     },
                     "carton_width": {
                        "type": "text"
                     },
                     "fob_city": {
                        "type": "text"
                     },
                     "fob_country_code": {
                        "type": "text"
                     },
                     "fob_state_code": {
                        "type": "text"
                     },
                     "fob_zip_code": {
                        "type": "text"
                     },
                     "free_on_board": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "import-tracker_id": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "product_height": {
                        "type": "text"
                     },
                     "product_id": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "product_length": {
                        "type": "text"
                     },
                     "product_size_unit": {
                        "type": "text"
                     },
                     "product_weight": {
                        "type": "text"
                     },
                     "product_weight_unit": {
                        "type": "text"
                     },
                     "product_width": {
                        "type": "text"
                     },
                     "qty_10_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_10_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_1_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_1_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_2_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_2_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_3_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_3_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_4_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_4_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_5_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_5_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_6_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_6_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_7_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_7_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_8_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_8_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_9_max": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "qty_9_min": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "shipping_qty_per_carton": {
                        "type": "double"
                     },
                     "shipping_range": {
                        "properties": {
                           "qty": {
                              "properties": {
                                 "gte": {
                                    "type": "long"
                                 },
                                 "lte": {
                                    "type": "long"
                                 }
                              }
                           }
                        }
                     },
                     "sku": {
                        "type": "long"
                     }
                  }
               },
               "sku": {
                  "type": "text",
                  "fields": {
                     "english": {
                        "type": "text",
                        "analyzer": "english"
                     },
                     "raw": {
                        "type": "text",
                        "analyzer": "keyword_lowercase_analyzer"
                     }
                  },
                  "fielddata": true
               },
               "special_price_valid_up_to": {
                  "type": "date"
               },
               "status": {
                  "type": "boolean"
               },
               "supplier": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "supplier_id": {
                  "type": "text"
               },
               "supplier_info": {
                  "properties": {
                     "company": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "email": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "supplier_name": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     },
                     "username": {
                        "type": "text",
                        "fields": {
                           "keyword": {
                              "type": "keyword",
                              "ignore_above": 256
                           }
                        }
                     }
                  }
               },
               "username": {
                  "type": "text",
                  "fields": {
                     "keyword": {
                        "type": "keyword",
                        "ignore_above": 256
                     }
                  }
               },
               "valid_up_to": {
                  "type": "date"
               },
               "vat": {
                  "type": "double"
               },
               "vat_unit": {
                  "type": "text"
               },
               "vid": {
                  "type": "text",
                  "fields": {
                     "raw": {
                        "type": "keyword"
                     }
                  }
               },
               "video_url": {
                  "type": "text"
               }
            }
         }
      },
      
      // Seed the form with a starting value
      startval: this.pdata
    });
  }
}
</script>

<style >
.pdmedit {
  padding: 40px;
}
/*html {
  font-family: Tahoma;
  font-size: 14px;
}

body {
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  line-height: 1.42857143;
  color: #333;
}*/

pre {
  overflow: auto;
}
  pre .string { color: #885800; }
  pre .number { color: blue; }
  pre .boolean { color: magenta; }
  pre .null { color: red; }
  pre .key { color: green; }    

h1 {
  text-align: center;
  font-size: 36px;
  margin-top: 20px;
  margin-bottom: 10px;
  font-weight: 500;
}
/*
fieldset {
  border: 0;
}
*/
.panel {
  margin-bottom: 20px;
  background-color: #fff;
  border: 1px solid transparent;
  border-radius: 4px;
  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
  box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
  border-color: #ddd;
}

.panel-heading {
  color: #333;
  background-color: #f5f5f5;
  border-color: #ddd;

  padding: 10px 15px;
  border-bottom: 1px solid transparent;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;        
}

.panel-body {
  padding: 15px;
}       

.field-checklist .wrapper {
  width: 100%;
}

fieldset {
  border: 1px solid white;
}
</style>