<template>
  <div>
    <Steps :current="currentStep" class="uploadSteps">
       <Step content="Upload"></Step>
       <Step content="Validate"></Step>
       <Step content="Import"></Step>
   </Steps>
   <template v-if="currentStep == 0 && uploadStep">
     <Row>
          <Col span="6" class="tabList">
                <vue-tabs active-tab-color="#494e6b"
                          active-text-color="#fff"
                          type="pills"
                          direction="vertical"
                          v-model="activeTab"
                          :tab-change="hideHandson()">

                     <div v-for="(files,fIndex) in fileTypes">
                           <v-tab :title=files :id="changeIndex(files)">
                              <!-- <img src="../assets/images/green_tick.jpg" alt="" style="width:20px;height:20px;"></img> -->
                           </v-tab>
                    </div>
                </vue-tabs>
                <div style="margin-top: 20px;position: absolute;top: 300px;">
                      <Button type="success" class="sucessbtn" size="large" style="font-size:15px" :disabled="validate" @click="startValidation()">Start validation<i class="ivu-icon ivu-icon-android-arrow-dropright-circle" style="margin-left:7%"></i></Button>
                </div>
          </Col>
          <Col span="18" class="tabView">
            <div id="uploadCsv" style="margin-top:5%;" v-model="mObj[activeTab]">
                <div>
                    <Form>
                      <FormItem label="Field Mapping">
                        <Row>
                        <Col span="5">
                        <Select v-model="mObj[activeTab].selected_schema" style="width:200px" @on-change="changeSchema(activeTab,mObj[activeTab].selected_schema)">
                            <Option v-for="schema in mObj[activeTab].schemaList" :value="schema.value" :key="schema.value">{{ schema.label }}</Option>
                        </Select>
                       </Col>



                       <Col span="3">
                        <Poptip placement="top" width="300" v-model = "mObj[activeTab].poptip_display">
                          <a @click="mObj[activeTab].poptip_display = true" v-if="mObj[activeTab].display">Untitled mapping</a>
                           <div class="api" slot="content">
                             <Form inline>
                               <FormItem>
                                   <Input type="text" v-model="mObj[activeTab].new_schema">
                                   </Input>
                               </FormItem>
                                  <Button type="ghost" class="btnghost" icon="ios-checkmark" style="font-size: 25px;" @click="validateSchema(activeTab,mObj[activeTab].new_schema)"></Button>
                                  <Button type="ghost" class="btnghost" icon="ios-close" style="font-size: 25px;margin-left: -20px;" @click="mObj[activeTab].poptip_display = false"></Button>
                           </Form>
                           </div>
                       </Poptip>
                     </Col>



                     <!-- <Col span="3">
                     <a @click="showUpload()" v-if="activeTab == 'Product Image'">Upload Image</a>
                     </Col> -->

                     <Col span="1" v-if="loadingdot">
                       <Spin></Spin>
                     </Col>

                     </Row>
                     </FormItem>
                   </Form>
                </div>

                <div id="upload-csv-zone" v-if="mObj[activeTab].uploadDisplay">
                  <div class="file-zone">
                      <span class="dz-message">Drop <span style="color: #494e6b">"{{activeTab}}"</span> files here<br/>
                          <small>(only csv files are valid.)</small>
                      </span>
                      <input type="file" id="csv-file" name="files" accept=".csv" @change="handleFileChange($event,activeTab)"/>
                  </div>
              </div>

              <div v-if="showWebImage">
                <div id="upload-csv-zone">
                  <div class="file-zone" @click="upldImage()">
                      <span class="dz-message">Drop images here<br/>
                          <small>(only jpg,png and gif files are valid.)</small>
                      </span>
                      <input type="file" id="image-file" name="images" multiple accept='image/*'/>
                  </div>
              </div>
              <div class="demo-upload-list" v-for="item in uploadList">
                <template>
                    <img :src="item.file_path">
                    <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                        <Icon type="ios-trash-outline"></Icon>
                    </div>
                </template>
            </div>
            </div>

            <Modal title="View Image" v-model="visible">
              <img :src="imgpath" v-if="visible" style="width: 100%">
           </Modal>

            <!-- <div v-if="showWebImage">
          <form action="/">
            <vue-dropzone ref="myVueDropzone" id="dropzone" :options="dropzoneOptions" @vdropzone-file-added="upldImage"></vue-dropzone>
          </form>
            </div> -->



              <div v-if="loading" class="demo-spin-col" style="margin-top:14px">  <Spin fix>
                        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                        <div>Loading</div>
                    </Spin></div>

              <div v-if="mObj[activeTab].load" class="demo-spin-col" style="margin-top:14px">  <Spin fix>
                        <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                        <div>Loading</div>
                    </Spin></div>


              <div v-if="mObj[activeTab].previewDisplay && mObj[activeTab].newUploadCSV.length != 0 ">
              <h2 style="margin-bottom:1%;text-transform: capitalize;">Preview of {{activeTab}}</h2>
               <div class="schema-form ivu-table-wrapper">
                 <div class="ivu-table ivu-table-border customtable" style="display:block;white-space: nowrap;">
                   <div class="ivu-table-body">
                     <table style="min-width:1077px;overflow-x: auto;">
                       <thead>
                         <tr>
                           <th v-for="(header,hindex) in Object.keys(mObj[activeTab].schema.structure)" v-if="!map && header != '_id'">
                             <div>
                               <span>{{header}}</span>
                             </div>
                           </th>
                         </tr>
                         <tr>
                           <th v-for="(header,hindex) in Object.keys(mObj[activeTab].newUploadCSV[0])" v-if="map && header != '_id'">
                             <div>
                               <span>{{header}}</span>
                             </div>
                           </th>
                         </tr>
                       </thead>
                       <tbody class="ivu-table-tbody" v-for="(item, index) in mObj[activeTab].newUploadCSV">
                         <tr class="ivu-table-row" v-if="(index<5)">
                           <td class="" v-for="data in getwithoutid(item,4)" style="overflow:hidden;">
                             {{data}}
                           </td>
                         </tr>

                       </tbody>
                     </table>
                   </div>
                 </div>
             </div>
             <Button type="error" style="margin-top:14px;float:right;margin-left:1%;width:7%" @click="Abort(activeTab)" v-if="mObj[activeTab].headerDisplay || mObj[activeTab].newSchemaDisplay" :disabled="ProceedLoading">Abort</Button>
             <Button type="success" style="margin-top:0px;color: #fff;background-color: #1fb58f;border-color: #1fb58f;margin-top:14px;float:right;width:10%" @click="Proceed(activeTab)" v-if="mObj[activeTab].headerDisplay || mObj[activeTab].newSchemaDisplay" :disabled="!proceedBtn" :loading="ProceedLoading">
              <span v-if="ProceedLoading">Processing</span>
              <span v-else>Proceed</span>
             </Button>
           </div>

           <div v-if="mObj[activeTab].savePreviewDisplay" class="savePreview">
             <div class="recordsDisplay">
             <h2 class="hclass">Uploaded Records of {{activeTab}}</h2>
             <Button type="ghost" class="close" @click="deleteRecModal = true"><Icon type="close-circled" class="redIcon"></Icon></Button>
            </div>
            <Row>
              <Col :span="12">
                <Button type="error" class="delete" @click="deleteSelModal = true" :disabled="delete1"><Icon type="trash-b"></Icon> Delete</Button>
              </Col>
              <Col :span="12" style="margin-top:5px">
                  <Row>
                    <Col :span="19">
                      <Input type="text"  class="" style="" placeholder="Filter" v-model="filterValue">
                        <Icon type="funnel" slot="prepend" class="funnel"></Icon>
                      </Input>
                    </Col>
                    <Col :span="5" class="buttons">
                      <!-- <Button type="ghost" class="apply" @click = "filter(filterValue,activeTab)" icon="ios-checkmark"></Button>
                      <Button type="ghost" class="reset" @click="reset()" icon="refresh"></Button> -->
                      <button type="submit" class="apply" @click = "filter(filterValue,activeTab)"><Icon type="ios-checkmark"></Icon></button>
                      <button type="submit" class="reset" @click="reset()" :disabled="disableReset"><Icon type="refresh"></Icon></button>
                    </Col>
                  </Row>
              </Col>
            </Row>


            <div class="schema-form ivu-table-wrapper previewtable">
              <div class="ivu-table ivu-table-border customtable" style="display:block;white-space: nowrap;">
                <div class="ivu-table-body">
                  <table style="min-width:1077px;overflow-x: auto;" v-if="mObj[activeTab].main_arr.length != 0">
                    <thead>
                      <tr>
                        <!-- <th>
                           <Checkbox ></Checkbox>
                        </th> -->
                        <th v-for="(header,hindex) in Object.keys(mObj[activeTab].schema.structure) " v-if="!map && header != '_id'">
                          <div>
                            <span>{{header}}</span>
                          </div>
                        </th>
                      </tr>
                      <tr>
                        <th>
                         <Checkbox v-model="mObj[activeTab].mPage[mObj[activeTab].cpage - 1].mCheck" @on-change="selectAllChunk()" class="check"></Checkbox>
                        </th>
                        <th v-for="(header,hindex) in Object.keys(mObj[activeTab].main_arr[mObj[activeTab].cpage - 1][0]) " v-if="map && header != '_id' && header != 'is_checked'">
                          <div>
                            <span>{{header}}</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="ivu-table-tbody" v-for="(item, index) in mObj[activeTab].main_arr[mObj[activeTab].cpage - 1]">
                      <tr class="ivu-table-row">
                        <td>
                           <Checkbox v-model="item['is_checked']" @on-change="PushToArray(item)"></Checkbox>
                        </td>
                        <td class=""  v-for="data in getwithoutid(item)" style="overflow:hidden;padding-left:15px;padding-right:15px">{{data}}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="pagination">
                  <Page :total="mObj[activeTab].newUploadCSV.length" :current="mObj[activeTab].cpage" @on-change="changePage" :page-size=5></Page>
                </div>
              </div>
          </div>
        </div>

          <Modal v-model="deleteRecModal" width="500">
           <p slot="header" style="color:#f60;text-align:center;font-size:20px">
               <Icon type="information-circled"></Icon>
               <span>Delete confirmation</span>
           </p>
           <div style="text-align:center">
               <p style="font-size:15px">Are you sure you want to delete?</p>
               <p style="font-size:15px">All your records will be deleted...</p>
           </div>
           <div slot="footer">
               <Button type="error" @click="abortUploadedRecords(activeTab)" style="backround-color:#13ce66,border-color:#13ce66">Yes</Button>
               <Button type="primary"  @click="deleteRecModal = false">No</Button>
           </div>
        </Modal>

        <Modal v-model="deleteSelModal" width="500">
         <p slot="header" style="color:#f60;text-align:center;font-size:20px">
             <Icon type="information-circled"></Icon>
             <span>Delete confirmation</span>
         </p>
         <div style="text-align:center">
             <p style="font-size:15px">Are you sure you want to delete?</p>
             <p style="font-size:15px">Your selected {{deletedValues.length}} records will be deleted...</p>
         </div>
         <div slot="footer">
             <Button type="error" @click="RemoveRecords(activeTab)" style="backround-color:#13ce66,border-color:#13ce66">Yes</Button>
             <Button type="primary"  @click="deleteSelModal = false">No</Button>
         </div>
      </Modal>

            <div v-if="mObj[activeTab].headerDisplay && mObj[activeTab].mapping.length != 0">
            <h2 style="margin-bottom:1%;text-transform: capitalize;margin-top:5%">Headers Mapping of {{activeTab}}</h2>
            <h3 style="color:red;font-size:13px;margin-bottom:1%">All the * marked fields are mandatory to map</h3>
             <div class="schema-form ivu-table-wrapper" >
               <div class="ivu-table ivu-table-border customtable" >
                 <div class="ivu-table-body">
                   <table class="mapping-table" style="width:100%;overflow-y:auto;">
                     <colgroup>
                       <col width="35">
                       <col width="35">
                       <col width="30">
                     </colgroup>
                     <thead>
                       <tr>
                         <th class="">System headers</th>
                         <th class="">CSV headers</th>
                         <th class="">Transform</th>
                       </tr>
                     </thead>
                     <tbody class="ivu-table-tbody">
                       <tr class="ivu-table-row" v-for="(item,index) in mObj[activeTab].mapping" v-if="item.sysHeader != '_id'">
                         <td>
                           <div class="ivu-table-cell" >
                             <span v-if="item.schemaObj.optional == false"><span style="color:red">*</span>{{item.sysHeader}}</span>
                              <span v-else>{{item.sysHeader}}</span>
                           </div>
                         </td>
                         <td>
                           <div class="ivu-table-cell">
                             <Select v-model="item.csvHeader" @on-change="mapHeader(item.sysHeader,item.csvHeader)">
                                 <Option v-for="header in mObj[activeTab].headers" :value="header" :key="header" >{{ header}}</Option>
                             </Select>
                           </div>
                         </td>
                         <td class="transform-block">
                           <div class="ivu-table-cell">
                               <a  @click="modelshow(item,index)"><Icon type="compose"></Icon></a>
                           </div>
                           <div v-if="item.transformMethod" class="transform-function" title="">
                               <span>{{item.transform}}</span>
                               <span  @click="removeTransform(item,index)"><Icon type="close-circled" /></span>
                           </div>
                         </td>
                       </tr>
                     </tbody>
                   </table>
                 </div>
               </div>
           </div>
         </div>

         <div v-if="mObj[activeTab].newSchemaDisplay">
         <h2 style="margin-bottom:1%;text-transform: capitalize;margin-top:5%">Headers Mapping of {{activeTab}}</h2>
         <h3 style="color:red;font-size:13px;margin-bottom:1%">All the * marked fields are mandatory to map</h3>
         <div class="schema-form ivu-table-wrapper">
           <div class="ivu-table ivu-table-border customtable" >
             <div class="ivu-table-body">
               <table class="mapping-table" style="width:100%;overflow-y:auto;">
                 <colgroup>
                   <col width="20">
                   <col width="20">
                   <col width="20">
                   <col width="20">
                   <col width="20">
                 </colgroup>
                 <thead>
                   <tr>
                     <th class="">System headers</th>
                     <th class="">CSV headers</th>
                     <th class="">Type</th>
                     <th class="">Property</th>
                     <th class="">Transform</th>
                   </tr>
                 </thead>
                 <tbody class="ivu-table-tbody">
                   <tr class="ivu-table-row" v-for="(item,index) in mObj[activeTab].mapping" v-if="item.sysHeader != '_id'">
                     <th>
                       <div class="ivu-table-cell headercolor">
                         <span v-if="item.schemaObj.optional == false"><span style="color:red">*</span> {{item.sysHeader}}</span>
                          <span v-else>{{item.sysHeader}}</span>
                       </div>
                     </th>
                     <td>
                       <div class="ivu-table-cell">
                         <Select v-model="item.csvHeader" @on-change="mapHeader(item.sysHeader,item.csvHeader)">
                             <Option v-for="header in mObj[activeTab].headers" :value="header" :key="header">{{ header}}</Option>
                         </Select>
                       </div>
                     </td>

                     <td class="">
                       <div class="ivu-table-cell">
                         <Select v-model="item.schemaObj.type">
                             <Option v-for="type in types" :value="type" :key="type" @on-change="mapType(item.sysHeader,type)">{{ type}}</Option>
                         </Select>
                       </div>
                     </td>

                     <td class="">
                       <div class="property ivu-table-cell">
                         <Poptip placement="left" width="300">
                           <a>
                             <Icon type="edit"></Icon>
                           </a>
                           <div slot="title">
                             <h3>Property</h3></div>
                           <div slot="content" class="prptycontent">
                             <!-- <Form> -->
                             <Form-item label="MaxLength" :label-width="1" class="prpty-label">
                               <Input  size="small" v-model="item.schemaObj.maxLength" ></Input>
                             </Form-item>
                             <Form-item  label="Allowed Value" :label-width="1" class="prpty-label">
                                <input-tag  :tags="item.schemaObj.allowedValues" class="allowedTags"></input-tag>
                             </Form-item>
                             <Form-item  label="Default Value" :label-width="1" class="prpty-label">
                               <Input size="small" v-model="item.schemaObj.defaultValue"></Input>
                             </Form-item>
                             <Form-item  label="regEx" :label-width="1" class="prpty-label">
                               <Input size="small" v-model="item.schemaObj.regEx"></Input>
                             </Form-item>
                             <Form-item  label="label" :label-width="1" class="prpty-label">
                               <Input size="small" v-model="item.schemaObj.label"></Input>
                             </Form-item>
                             <Form-item  label="" :label-width="1" class="prpty-label">
                               <Checkbox  id="prptychckbox" class="propertychbx" v-model="item.schemaObj.optional">Optional</Checkbox>
                             </Form-item>
                           <!-- </Form> -->
                           </div>
                         </Poptip>
                       </div>
                     </td>

                     <td class="transform-block">
                       <div class="ivu-table-cell">
                           <a  @click="modelshow(item,index)"><Icon type="compose"></Icon></a>
                       </div>
                       <div v-if="item.transformMethod" class="transform-function" title="">
                           <span>{{item.transform}}</span>
                           <span  @click="removeTransform(item,index)"><Icon type="close-circled" /></span>
                       </div>
                     </td>
                   </tr>
                 </tbody>
               </table>
             </div>
           </div>
       </div>
     </div>

         <div id="example1" class="hot handsontable htColumnHeaders" style="overflow-x: auto"></div>
         <table>
           <tr>
           <td class="ivu-table-row" style="color:red;font-size:14px;">{{mObj[activeTab].errmsg[0]}}</td>
         </tr>
         </table>
         <div id="hot-preview" v-if="mObj[activeTab].showHandson">
           <Button type="error" @click="AbortValidation(activeTab)" style="float:right;margin-right:10px;">Abort Data</Button>
         </div>
         <div id="hot-preview" v-if="mObj[activeTab].showHandson">
           <Button type="primary" @click="modifyData(activeTab)" style="float: right;margin-right: 20px;">Save Data</Button>
         </div>

         <Modal  v-model="model" title="Transform" @on-ok="handleModalOk" width="900px" :mask-closable="false ">
           <Row style="padding: 10px;">
             <Col span="18">
                 <codemirror v-model="transformData" :options="editorOptions"></codemirror>
             </Col>
             <Col span="6">
               <div class="transform-method">
                 <ul>
                   <li>
                     <a href="javascript:void(0)" data-method="toUpperCase()" @click="transform">UpperCase</a>
                   </li>
                   <li>
                     <a href="javascript:void(0)" data-method="toLowerCase()" @click="transform">LowerCase</a>
                   </li>
                   <li>
                     <a href="javascript:void(0)" data-method="ltrim()" @click="transform">Right Trim</a>
                   </li>
                   <li>
                     <a href="javascript:void(0)" data-method="rtrim()" @click="transform">Left Trim</a>
                   </li>
                   <li>
                     <a href="javascript:void(0)" data-method="concate()" @click="transform">Concat</a>
                   </li>
                   <li>
                     <a href="javascript:void(0)" data-method="capitalize()" @click="transform" >Capitalize</a>
                   </li>
                   <li>
                     <a href="javascript:void(0)" data-method="stripHTMLTags()" @click="transform">Stripe HTML Tags</a>
                   </li>
                   <li>
                     <a href="javascript:void(0)" data-method="stripSpecialCharacter()" @click="transform">Stripe Special Character</a>
                   </li>
                   <li>
                     <a href="javascript:void(0)" data-method="formatDate('dd-mm-yyyy')" @click="transform">Date Format</a>
                   </li>
                   <li>
                     <a href="javascript:void(0)" data-method="toDecimal(2)" @click="transform">Decimal</a>
                   </li>
                   <li>
                     <a href="javascript:void(0)" data-method="toInteger()" @click="transform">Integer</a>
                   </li>
                 </ul>
               </div>
             </Col>
           </Row>
         </Modal>

         <Modal v-model="modal1" width="500" @on-cancel="cancel" >
          <p slot="header" style="color:#f60;text-align:center;font-size:20px">
              <Icon type="information-circled"></Icon>
              <span>Some of your headers are not mapped ...</span>
          </p>
          <div style="text-align:center">
              <p style="font-size:15px">Want to map headers or Continue as it is ?</p>
              <p style="font-size:15px">Click map to map headers and Continue to proceed as it is.</p>
          </div>
          <div slot="footer">
              <Button type="primary" @click="mapHeaders(activeTab)" style="backround-color:#13ce66,border-color:#13ce66">Map</Button>
              <Button type="primary"  @click="continuee(activeTab)"  style="background-color:#1fb58f;border-color:#1fb58f;" v-if="showContinue" :disabled="!showContinue">
                <!-- <span v-if="showContinue">Continue</span>
                <span v-else>Processing...</span> -->
                Continue
              </Button>
          </div>
       </Modal>

        </div>
      </Col>
    </Row>
    </template>
    <template v-if="currentStep == 1 && validateStep">
      <Card :bordered=false style="margin-top:30px">
      <div v-if="validating" class="demo-spin-col">  <Spin fix>
                <Icon type="load-c" size=18 class="demo-spin-icon-load"></Icon>
                <div>Loading</div>
            </Spin></div>

        <div>
        <h2 style="margin-bottom:1%;text-transform: capitalize;" v-if="showValidationTable">Validation Status</h2>
         <div class="schema-form ivu-table-wrapper" >
           <div class="ivu-table ivu-table-border customtable border" >
             <div class="ivu-table-body">
               <table class="mapping-table" style="width:100%;overflow-y:auto;" id="valid_err">
                 <colgroup>
                   <col width="20">
                   <col width="20">
                   <col width="20">
                   <col width="20">
                   <col width="20">
                 </colgroup>
                 <thead v-if="showValidationTable">
                   <tr>
                     <th class="">Validation File Type</th>
                     <th class="">File Uploaded On</th>
                     <th class="">Validation Status</th>
                     <th class="">Total No of Records</th>
                     <th class="">Validation Progress</th>
                   </tr>
                 </thead>
                 <tbody class="ivu-table-tbody" v-if="!validation_data">
                   <tr class="ivu-table-row" v-for="(item,index) in val_data" :id="item.name">
                     <td>
                       <div class="ivu-table-cell">
                         <span>{{convert(item.name)}}</span>
                       </div>
                     </td>
                     <td>
                       <div class="ivu-table-cell">
                        <span>{{moment(item.data.uploadedAt).fromNow()}}</span>
                       </div>
                     </td>
                     <td>
                       <div class="ivu-table-cell">
                         <span>{{item.data.validateStatus}}</span>
                       </div>
                     </td>
                     <td>
                       <div class="ivu-table-cell">
                         <span>{{item.data.totalNoOfRecords}}</span>
                       </div>
                     </td>
                     <td>
                       <div class="ivu-table-cell">
                         <span>
                           <div class="ivu-table-cell">
                             <i-circle :percent="item.progress" style="width:45px;height:45px;">
                               <span style="font-size:12px">{{item.progress}}%</span>
                             </i-circle>
                           </div>
                         </span>
                       </div>
                     </td>
                   </tr>
                   <!-- <tr>
                    <td colspan="5">
                       <div id="validation_err" class="hot handsontable htColumnHeaders"></div>
                    </td> -->
                     <!-- <table> -->
                       <!-- <tr>
                       <td class="ivu-table-row"  style="color:red;font-size:14px;" v-if="validation_err_fields != ''">{{validation_err_fields}}</td>
                     </tr> -->
                     <!-- </table> -->
                     <!-- <div id="hot-preview" v-if="proceedNext">
                       <Button type="primary" @click="proceedToNext()" style="float: right;margin-right: 20px;">Proceed To Next</Button>
                     </div> -->
                   <!-- </tr> -->
                 </tbody>
               </table>
               <!-- <div id="validation_err" class="hot handsontable htColumnHeaders"></div> -->
             </div>
           </div>
       </div>
      </div>


      <div v-if="validation_completed"><p style="font-size:18px;margin-top:20px;">The file has been successfully validated without any error. Now you can proceed to import it into PDM.</p></div>
      <Button type="error" @click="abortImport()" v-if="validation_completed" style="font-size:15px;margin-top:25px;float:right;">Abort</Button>
      <Button type="primary" @click="importToPDM()" v-if="validation_completed" style="font-size:15px;margin-top:25px;float:right;margin-right: 10px;">Import</Button>
      </Card>
    </template>
    <template v-if="currentStep == 2 && importStep">
      <Card :bordered=false style="margin-top:30px">
        <div v-if="!import1">
          <h2>Import in progress</h2>
          <p style="font-size:16px;margin-top:20px">It will take some time...Please wait...</p>
          <!-- <Button type="error" @click="abortImportInProgress()"  style="font-size:15px;margin-top:25px;float:right;margin-right:10px;">Abort</Button> -->
        </div>
      <div v-if="import1"><h2>Import Completed</h2></div>
      <div v-if="import1"><p style="font-size:18px;margin-top:20px">Product data has been successfully imported into PDM. Ready to go live...!!!</p></div>
      <Button type="error" @click="abortImportConfirm()"  v-if="abortImportBtn" style="font-size:15px;margin-top:25px;float:right;">Abort</Button>
      <Button type="success" id="importBtn" @click="importToConfirm()"  v-if="import1" style="font-size:15px;margin-top:25px;float:right;margin-right:10px;" :disabled="!importBtn">Go Live</Button>
      </Card>
    </template>
   </div>
</template>

<!-- <script src="https://sdk.amazonaws.com/js/aws-sdk-2.1.24.min.js"></script> -->
<script>
/*eslint-disable*/
let axios = require("axios")
let atob = require('atob');
import api from '../api'
import schema from '../api/schema'
import config from '@/config'
import config1 from '../../config'
import io from 'socket.io-client'
import feathers from 'feathers/client';
import socketio from 'feathers-socketio/client';
import {VueTabs, VTab} from 'vue-nav-tabs'
import InputTag from 'vue-input-tag'
import Papa from 'papaparse'
import 'vue-nav-tabs/themes/vue-tabs.css'
import _ from 'underscore'
import lodash from 'lodash'
import Vue from 'vue'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.css'
import VueCodeMirror from 'vue-codemirror'
import $ from 'jquery';
var moment = require('moment');
import ProductInformationSchema from '@/schema/product_information'
import ProductPricingSchema from '@/schema/product_price'
import ProductImagesSchema from '@/schema/product_images'
import ProductImprintDataSchema from '@/schema/product_imprint_data'
import ProductShippingSchema from '@/schema/product_shipping'
import ProductVariationSchema from '@/schema/product_variation_pricing'
import ProductAdditionalChargesSchema from '@/schema/product_additional_charge'


Vue.use(VueCodeMirror)
moment().format();
var Schema = require('simpleschema')
const uuidV1 = require('uuid/v1');
let finalModifiedDataArray = []
let globalValidateResolve = null
let res
let id
let file
let obj1
let schema_id = ''
let CSVFile_id = ''
let new_flag = 0
let err_length = 0
let prop_keys = []
let uploader_obj = {}
let validation_obj = {}
let map_flag = false
let continue_flag = false
let errors_length = 0
let prod_info_upld = false
let cpage_array = []
let mounted_flag = false
let no_of_uplds = 0
let notice_flag = true
let complete_flag = true
let totalRecords = 0
let load_flag = true

let socket
if (process.env.NODE_ENV !== 'development') {
  socket = io(config.socketURI,{reconnect: true})
} else {
  socket = io(config.socketURI,{reconnect: true})
}

const app = feathers().configure(socketio(socket))


export default {
    name: 'mainUpload',
    components: { VueTabs,VTab,'input-tag': InputTag,vueDropzone: vue2Dropzone},
    data () {
        return {
          moment : moment,
          currentStep:0,
          map : false,
          fileTypes: ["Product Variation Price","Product Information","Product Price","Product Imprint Data","Product Image","Product Shipping","Product Additional Charges"],
          activeTab: 'Product Information',
          fileNames : ["ProductInformation","ProductPrice","ProductImprintData","ProductImage","ProductShipping","ProductAdditionalCharges","ProductVariationPrice"],
          validate:true,
          types: ["string","number","boolean","date","url","phone","pin-code"],
          existingSchemaData :[],
          validating : true,
          validation_data: false,
          validation_completed: false,
          import1 :false,
          loading: false,
          transformData: '',
          transformMethod: '',
          modelIndex: '',
          editorOptions: {
            tabSize: 4,
            mode: 'text/javascript',
            theme: 'base16-light',
            lineNumbers: true,
            line: true,
            // keyMap: 'sublime',
            extraKeys: { 'Ctrl': 'autocomplete' },
            foldGutter: true,
            gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
            styleSelectedText: true,
            highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: true },
            autofocus: true
          },
          model: false,
          showValidationTable: false,
          proceedNext: false,
          validation_err_fields: '',
          error_data: [],
          val_data: [],
          modal1: false,
          validation_completed: false,
          proceedBtn: true,
          loadingdot: false,
          delete1: true,
          schemaList: [
                    {
                        value: '--Add new--',
                        label: '--Add new--'
                    }
                ],
          deletedValues: [],
          importBtn: true,
          deleteRecModal: false,
          deleteSelModal: false,
          filterValue: '',
          uploadStep: false,
          validateStep: false,
          importStep: false,
          disableReset: true,
          showWebImage: false,
          defaultList: [],
          imgpath: '',
          visible: false,
          uploadList: [],
          dropzoneOptions: {
             url:'',
             dictDefaultMessage: 'Drag and drop file here to upload ',
             parallelUploads: 5
         },
         showContinue: false,
         // loadProcessing: false,
         // loadProceed: false,
         abortImportBtn: false,
         calledfromModify: false,
         calledFromAbort: false,
         ProceedLoading: false,
          mObj:{
          'Product Information':{
                  selected_schema: '',
                  display: false,
                  new_schema: 'Untitled mapping',
                  poptip_display:false,
                  allowedFileType: ['text/csv'],
                  uploadCSV:[],
                  headerDisplay:false,
                  previewDisplay: false,
                  headers:[],
                  uploadDisplay:false,
                  schema:ProductInformationSchema,
                  mapping:[],
                  errDisplay: false,
                  showHandson: false,
                  errmsg: [],
                  data1: [],
                  headers1: [],
                  newSchemaDisplay : false,
                  newUploadCSV : [],
                  new_flag : 0,
                  csv_arr: [],
                  savePreviewDisplay :false,
                  main_arr: [],
                  csv: [],
                  filter_flag: [],
                  load: false,
                  mPage:[],
                  cpage:1,
                  tab_flag:false,
                  complete_flag: false,
                  schemaList: [
                            {
                                value: '--Add new--',
                                label: '--Add new--'
                            }
                        ],

          },
          'Product Price':{
                  selected_schema: '',
                  display: false,
                  new_schema: 'Untitled mapping',
                  poptip_display:false,
                  allowedFileType: ['text/csv'],
                  uploadCSV:[],
                  headerDisplay:false,
                  previewDisplay: false,
                  headers:[],
                  uploadDisplay:false,
                  schema:ProductPricingSchema,
                  mapping:[],
                  errDisplay: false,
                  showHandson: false,
                  errmsg: [],
                  data1: [],
                  headers1: [],
                  newSchemaDisplay : false,
                  newUploadCSV : [],
                  new_flag : 0,
                  csv_arr : [],
                  savePreviewDisplay :false,
                  main_arr: [],
                  csv: [],
                  filter_flag: [],
                  load: false,
                  mPage:[],
                  cpage:1,
                  tab_flag:false,
                  complete_flag: false,
                  schemaList: [
                            {
                                value: '--Add new--',
                                label: '--Add new--'
                            }
                        ]


          },
          'Product Imprint Data':{
                  selected_schema: '',
                  display: false,
                  new_schema: 'Untitled mapping',
                  poptip_display:false,
                  allowedFileType: ['text/csv'],
                  uploadCSV:[],
                  headerDisplay:false,
                  previewDisplay: false,
                  headers:[],
                  uploadDisplay:false,
                  schema:ProductImprintDataSchema,
                  mapping:[],
                  errDisplay: false,
                  showHandson: false,
                  errmsg: [],
                  data1: [],
                  headers1: [],
                  newSchemaDisplay : false,
                  newUploadCSV : [],
                  new_flag : 0,
                  csv_arr: [],
                  savePreviewDisplay :false,
                  main_arr: [],
                  csv: [],
                  filter_flag: [],
                  load: false,
                  mPage:[],
                  cpage:1,
                  tab_flag:false,
                  complete_flag: false,
                  schemaList: [
                            {
                                value: '--Add new--',
                                label: '--Add new--'
                            }
                        ]
          },
          'Product Image':{
                  selected_schema: '',
                  display: false,
                  new_schema: 'Untitled mapping',
                  poptip_display:false,
                  allowedFileType: ['text/csv'],
                  uploadCSV:[],
                  headerDisplay:false,
                  previewDisplay: false,
                  headers:[],
                  uploadDisplay:false,
                  schema:ProductImagesSchema,
                  mapping:[],
                  errDisplay: false,
                  showHandson: false,
                  errmsg: [],
                  data1: [],
                  headers1: [],
                  newSchemaDisplay : false,
                  newUploadCSV : [],
                  new_flag : 0,
                  csv_arr: [],
                  savePreviewDisplay :false,
                  main_arr: [],
                  csv: [],
                  filter_flag: [],
                  load: false,
                  mPage:[],
                  cpage:1,
                  tab_flag:false,
                  complete_flag: false,
                  schemaList: [
                            {
                                value: '--Add new--',
                                label: '--Add new--'
                            }
                        ]
          },
          'Product Shipping':{
                  selected_schema: '',
                  display: false,
                  new_schema: 'Untitled mapping',
                  poptip_display:false,
                  allowedFileType: ['text/csv'],
                  uploadCSV:[],
                  headerDisplay:false,
                  previewDisplay: false,
                  headers:[],
                  uploadDisplay:false,
                  schema:ProductShippingSchema,
                  mapping:[],
                  errDisplay: false,
                  showHandson: false,
                  errmsg: [],
                  data1: [],
                  headers1: [],
                  newSchemaDisplay : false,
                  newUploadCSV : [],
                  new_flag : 0,
                  csv_arr: [],
                  savePreviewDisplay :false,
                  main_arr: [],
                  csv: [],
                  filter_flag: [],
                  load: false,
                  mPage:[],
                  cpage:1,
                  tab_flag:false,
                  complete_flag: false,
                  schemaList: [
                            {
                                value: '--Add new--',
                                label: '--Add new--'
                            }
                        ]
          },
          'Product Additional Charges':{
                  selected_schema: '',
                  display: false,
                  new_schema: 'Untitled mapping',
                  poptip_display:false,
                  allowedFileType: ['text/csv'],
                  uploadCSV:[],
                  headerDisplay:false,
                  previewDisplay: false,
                  headers:[],
                  uploadDisplay:false,
                  schema:ProductAdditionalChargesSchema,
                  mapping:[],
                  errDisplay: false,
                  showHandson: false,
                  errmsg: [],
                  data1: [],
                  headers1: [],
                  newSchemaDisplay : false,
                  newUploadCSV : [],
                  new_flag : 0,
                  csv_arr: [],
                  savePreviewDisplay :false,
                  main_arr: [],
                  csv: [],
                  filter_flag: [],
                  load: false,
                  mPage:[],
                  cpage:1,
                  tab_flag:false,
                  complete_flag: false,
                  schemaList: [
                            {
                                value: '--Add new--',
                                label: '--Add new--'
                            }
                        ]
          },
          'Product Variation Price':{
                  selected_schema: '',
                  display: false,
                  new_schema: 'Untitled mapping',
                  poptip_display:false,
                  allowedFileType: ['text/csv'],
                  uploadCSV:[],
                  headerDisplay:false,
                  previewDisplay: false,
                  headers:[],
                  uploadDisplay:false,
                  schema:ProductVariationSchema,
                  mapping:[],
                  errDisplay: false,
                  showHandson: false,
                  errmsg: [],
                  data1: [],
                  headers1: [],
                  newSchemaDisplay : false,
                  newUploadCSV : [],
                  new_flag : 0,
                  csv_arr: [],
                  savePreviewDisplay :false,
                  main_arr: [],
                  csv: [],
                  filter_flag: [],
                  load: false,
                  mPage:[],
                  cpage:1,
                  tab_flag:false,
                  complete_flag: false,
                  schemaList: [
                            {
                                value: '--Add new--',
                                label: '--Add new--'
                            }
                        ]
          }
        }
    }
  },
    methods:{
      async handleFileChange (e,tab) {
        let self = this
        file =  e.target.files[0]

        let file_ext = file.name.split('.').pop()
        if(file_ext != 'csv'){
          self.$Notice.error({title: 'Only CSV files are allowed',duration: 1})
        }
        else{

          self.mObj[tab].load = true
          // self.loadProcessing = false
          self.mObj[tab].uploadDisplay = false
          let my_flag = true
            Papa.parse(file, {
              header: true,
              dynamicTyping: true,
              encoding: "UTF-8",
              skipEmptyLines: true,
              preview: 5,
              chunk: await (function(results, streamer) {

              // map the user selected headers -> results
              // do the validation`
              // send results to server
              // if abort pressed, discard the stored data on server
              // else commit the stored data on server for import / live

                self.mObj[tab].uploadCSV = results.data
                self.mObj[tab].headers = Object.keys(self.mObj[tab].uploadCSV[0])
                self.mObj[tab].headers.push("_id")
                // self.loadProceed = false
                // self.mObj[tab].load = true
                if(self.mObj[tab].new_flag == 1){
                  if(my_flag == true){
                    self.mObj[tab].load = true
                    my_flag = false
                    setTimeout(function(){self.mObj[tab].mapping = []
                      self.generateHeadersandMapping(tab)},1)

                  }
                }
                else{
                  if(my_flag == true){
                    self.mObj[tab].load = true
                    my_flag = false
                    if(self.mObj[tab].newSchemaDisplay == true){
                      self.mObj[tab].newSchemaDisplay = false
                    }
                    self.mObj[tab].mapping = []
                    self.getMapping(tab)
                  }
                }
              })
            })

        }
      },
      handleView (item) {
        let self = this
        self.imgpath = item.file_path;
        self.visible = true;
      },
      retResult(reader){

        let _promise = new Promise((resolve, reject) => {
            reader.addEventListener('load',function () {
              let result = reader.result
              resolve(result)
              // return result
            }, false);
        })
        return Promise.resolve(_promise)
      },
      upldImage(file){
        let self = this
          const reader  = new FileReader();
          $(document).ready(function () {
            // $('#image-file').change(async function () {
            //   let fileChooser = document.getElementById('image-file');
            //   let file1 = fileChooser.files[0]
            //
            //   let file_ext = file1.name.split('.').pop()
            //   let ext = ['jpg','jpeg','gif','png']
            //   let ext_idx = lodash.findIndex(ext, function(o) { return o == file_ext; });
            //   if(ext_idx == -1){
            //     self.$Notice.error({title: 'Only jpg,png and gif files are allowed',duration: 200})
            //   }
            //   else{
            //     // console.log("max.....",$(this).attr(max))
            //     if(no_of_uplds > 5)
            //      {
            //      self.$Notice.error({title: 'Only 5 images can be uploaded',duration: 200})
            //      }
            //      else
            //      {
            //       no_of_uplds =  no_of_uplds + 1;
            //       reader.readAsDataURL(file1);
            //       let uri = await self.retResult(reader)
            //
            //       api.request('post', '/upload-image/',{uri:uri,file_name:file1.name}).then(response => {
            //
            //         self.uploadList.push(response.data)
            //       });
            //      }
            //   }
            //
            // })
          })
    },
      showUpload(){
        let self = this
        self.mObj[self.activeTab].uploadDisplay = false
        if(self.mObj[self.activeTab].previewDisplay == true){
          self.mObj[self.activeTab].previewDisplay = false
        }
        if(self.mObj[self.activeTab].savePreviewDisplay == true){
          self.mObj[self.activeTab].savePreviewDisplay = false
        }
        if(self.mObj[self.activeTab].headerDisplay == true){
          self.mObj[self.activeTab].headerDisplay = false
        }
        if(self.mObj[self.activeTab].newSchemaDisplay == true){
          self.mObj[self.activeTab].newSchemaDisplay = false
        }
        self.showWebImage = true
      },

      //to reset the filter
      reset(){
          if(this.mObj[this.activeTab].filter_flag == true){
            this.filterValue = ''
            this.mObj[this.activeTab].newUploadCSV = []
            this.mObj[this.activeTab].newUploadCSV = this.mObj[this.activeTab].csv
            this.mObj[this.activeTab].main_arr = lodash.chunk(this.mObj[this.activeTab].newUploadCSV, 5);
            this.disableReset = true
          }
      },

      //filter data according to the selected value
      filter(filterValue,tab){
        this.mObj[tab].filter_flag = true
        let main_array = []
        this.disableReset = false
        if(filterValue != ''){
          this.mObj[tab].csv = this.mObj[tab].newUploadCSV
          for(let i=0 ;i < this.mObj[tab].newUploadCSV.length; i++){
            for(let key in this.mObj[tab].newUploadCSV[i]){
              if(this.mObj[tab].newUploadCSV[i][key] == filterValue){
               main_array.push(this.mObj[tab].newUploadCSV[i])
              }
            }
          }

          this.mObj[tab].newUploadCSV = []
          this.mObj[tab].newUploadCSV = main_array

          if(this.mObj[tab].newUploadCSV.length > 0){
            this.mObj[tab].main_arr = lodash.chunk(this.mObj[tab].newUploadCSV, 5);
          }

          if(this.mObj[tab].main_arr[this.mObj[tab].cpage - 1] == undefined){
            this.mObj[tab].cpage = 1
          }
        }

      },

      //pagination
      changePage(page) {
        this.mObj[this.activeTab].cpage = page
      },

      selectAllChunk(){
        let page = this.mObj[this.activeTab].cpage
        let mCheck = this.mObj[this.activeTab].mPage[page-1].mCheck
        cpage_array.push(page)
        let self = this

        this.mObj[this.activeTab].newUploadCSV = []
        for(let i=0 ;i < this.mObj[this.activeTab].main_arr.length;i++){
          for(let key in this.mObj[this.activeTab].main_arr[i]){
            this.mObj[this.activeTab].newUploadCSV = lodash.unionBy(this.mObj[this.activeTab].newUploadCSV,this.mObj[this.activeTab].main_arr[i])
          }
        }


        if(mCheck == true){
          for(let i=0 ;i < this.mObj[this.activeTab].main_arr[page-1].length;i++){
            for(let key in this.mObj[this.activeTab].main_arr[page-1][i]){
              if(key == 'is_checked'){
                this.mObj[this.activeTab].main_arr[page-1][i][key] = true
              }
            }
            this.deletedValues.push(this.mObj[this.activeTab].main_arr[page-1][i])
          }
          this.delete1 = false

        }
        else if(mCheck == false){
          for(let i=0 ;i < this.mObj[this.activeTab].main_arr[page-1].length;i++){
            for(let key in this.mObj[this.activeTab].main_arr[page-1][i]){
              if(key == 'is_checked'){
                this.mObj[this.activeTab].main_arr[page-1][i][key] = false
              }
              let findidx = lodash.findIndex(this.deletedValues, function(o) { return o._id == self.mObj[self.activeTab].main_arr[page-1][i]._id; });

              if(findidx > -1){
                  this.deletedValues.splice(findidx,1)
              }
            }
          }

          // for(let i=0;i<this.deletedValues.length;i++){
          // for(let j=0 ;j < this.mObj[this.activeTab].main_arr[page-1].length;j++){
          //     for(let key in this.mObj[this.activeTab].main_arr[page-1][j]){
          //       console.log(this.mObj[this.activeTab].main_arr[page-1][j]["_id"],this.deletedValues[i]._id)
          //       if(this.deletedValues[i]._id == this.mObj[this.activeTab].main_arr[page-1][j]["_id"]){
          //           this.deletedValues.splice(i,1)
          //       }
          //     }
          //   }
          // }

        }



      },

      // Pushes the selected values required to be deleted in an array
      PushToArray(item){
        this.delete1 = false
        this.mObj[this.activeTab].newUploadCSV = []
        for(let i=0 ;i < this.mObj[this.activeTab].main_arr.length;i++){
          for(let key in this.mObj[this.activeTab].main_arr[i]){
            this.mObj[this.activeTab].newUploadCSV = lodash.unionBy(this.mObj[this.activeTab].newUploadCSV,this.mObj[this.activeTab].main_arr[i])
          }
        }


        if(item.is_checked == true){
          this.deletedValues.push(item)
        }
        else if(item.is_checked == false){
          let findidx = lodash.findIndex(this.deletedValues, function(o) { return o._id == item._id; });
          if(findidx > -1){
              this.deletedValues.splice(findidx,1)
          }
        }
      },

      // Deletes the selected records
      RemoveRecords(tab){
        let self = this
        self.deleteSelModal = false
        let del_ids = []

        if(self.mObj[tab].filter_flag == true){
          for(let i=0; i<self.deletedValues.length ;i++){

            let findidx = lodash.findIndex(self.mObj[tab].csv, function(o) { return o._id == self.deletedValues[i]._id; });
            if(findidx !== -1){
              self.mObj[tab].csv.splice(findidx,1)
            }
          }

          for(let i=0; i<self.deletedValues.length ;i++){

            let findidx2 = lodash.findIndex(self.mObj[tab].newUploadCSV, function(o) { return o._id == self.deletedValues[i]._id; });
            if(findidx2 !== -1){
              self.mObj[tab].newUploadCSV.splice(findidx2,1)
            }

          }

          if(self.mObj[tab].newUploadCSV.length == 0){

            self.mObj[tab].main_arr = []
            if(cpage_array.length > 0){
              for(let i=0;i<cpage_array.length;i++){
                if(self.mObj[tab].mPage[cpage_array[i]-1].mCheck == true){
                  self.mObj[tab].mPage[cpage_array[i]-1].mCheck = false
                }
              }
              cpage_array = []
            }
          }
          else if(self.mObj[tab].newUploadCSV.length > 0){

            self.mObj[tab].main_arr = []
            self.mObj[tab].main_arr = lodash.chunk(self.mObj[tab].newUploadCSV, 5);
            if(cpage_array.length > 0){
              for(let i=0;i<cpage_array.length;i++){
                if(self.mObj[tab].mPage[cpage_array[i]-1].mCheck == true){
                  self.mObj[tab].mPage[cpage_array[i]-1].mCheck = false
                }
              }
              cpage_array = []
            }

            if(self.mObj[tab].main_arr[self.mObj[tab].cpage - 1] == undefined){
              self.mObj[tab].cpage =  1
            }
          }


        }
        else{
          for(let i=0; i<self.deletedValues.length ;i++){
            let findidx = lodash.findIndex(self.mObj[tab].newUploadCSV, function(o) { return o._id == self.deletedValues[i]._id; });

            if(findidx !== -1){
              self.mObj[tab].newUploadCSV.splice(findidx,1)
            }
          }

          if(self.mObj[tab].newUploadCSV.length != 0){
            self.mObj[tab].main_arr = []
            self.mObj[tab].main_arr = lodash.chunk(self.mObj[tab].newUploadCSV, 5);
          }

          if(cpage_array.length > 0){
            for(let i=0;i<cpage_array.length;i++){
              if(self.mObj[tab].mPage[cpage_array[i]-1].mCheck == true){
                self.mObj[tab].mPage[cpage_array[i]-1].mCheck = false
              }
            }
            cpage_array = []
          }

          if(self.mObj[tab].main_arr[self.mObj[tab].cpage - 1] == undefined){
              self.mObj[tab].cpage = 1
          }

        }

        for(let value in self.deletedValues){
          del_ids.push(self.deletedValues[value]._id)
        }




        api.request('delete', '/pdm-uploader-data/' + this.$route.params.id + '?sheet_name=' + tab + '&deletedIds=' + del_ids).then(res => {
          if(res !== undefined){
            self.deletedValues = []
            if(self.mObj[tab].csv.length == 0 && self.mObj[tab].newUploadCSV.length  == 0){
              this.mObj[tab].savePreviewDisplay = false
              this.mObj[tab].uploadDisplay = true
              self.mObj[tab].uploadCSV = []
              this.mObj[tab].newUploadCSV = []
            }
          }
          self.delete1 = true
        })


      },

      //Removes id from the data to be displayed
      getwithoutid (obj,value) {
        if(obj.hasOwnProperty("is_checked")){
          let pObj = lodash.cloneDeep(obj)
          return lodash.omit(pObj, '_id','is_checked')
        }
        else{
          let pObj = lodash.cloneDeep(obj)
          return lodash.omit(pObj, '_id')
        }
      },
      changeIndex(files){
        let newIndex = files.replace(/ /g,"_");
        return newIndex
      },
      tabClick(){

      },
      //Manages the client side validation handson table in different tabs
      hideHandson(){
        let self = this
          if(err_length != 0){
            if(self.mObj[self.activeTab].errDisplay == false ){
              if(document.getElementById('example1') != null || document.getElementById('example1') != undefined){
                if(document.getElementById('example1').innerHTML == ""){
                }
                else{
                  document.getElementById('example1').style.display = 'none'
                }
                 // document.getElementById('example1').innerHTML = ""
              }
              else{

              }
            }
            else if(self.mObj[self.activeTab].errDisplay == true ){
              if(document.getElementById('example1') != null || document.getElementById('example1') != undefined ){
               document.getElementById('example1').style.display = 'block'
             }
            }

          }


          let tab = self.activeTab.replace(/\s/g, "")

          if(self.mObj[self.activeTab].tab_flag == true && self.mObj[self.activeTab].newUploadCSV.length == 0){
            self.mObj[self.activeTab].tab_flag = false
            self.arrangeTab(tab,self.$route.params.id)
          }
      },

      // Transform functions..........
      setTransForm: function () {
        this.transformData = this.modelData
        if (this.mObj[this.activeTab].mapping[this.modelIndex].tranformMethod) {
          this.dataMethod = this.mObj[this.activeTab].mapping[this.modelIndex].tranformMethod
          this.transformData = this.modelData + '.' + this.dataMethod
        }
      },
      modelshow: function (item, index) {
        this.model = true
        this.modelData = 'return row["' + item.sysHeader + '"]'
        this.modelIndex = index
        this.dataMethod = ''
        this.setTransForm()
      },
      handleModalOk () {
          let methodName = this.transformData.split('.')
          this.dataMethod = methodName[1]
          if (this.dataMethod) {
            this.mObj[this.activeTab].mapping[this.modelIndex].transform = this.transformData
            this.mObj[this.activeTab].mapping[this.modelIndex].transformMethod = this.dataMethod
          } else {
            this.mObj[this.activeTab].mapping[this.modelIndex].transform = this.transformData
            this.mObj[this.activeTab].mapping[this.modelIndex].transformMethod = ''
          }
          var self = this

          self.mObj[self.activeTab].newUploadCSV = _.map(self.mObj[self.activeTab].csv_arr, function (row, rinx) {
            return _.reduce(row, function (result, value, key) {
              let inx = _.find(self.mObj[self.activeTab].mapping, (f) => { return (f.sysHeader === key) })
              if (inx.transform !== '') {
                var s = new Function('row', inx.transform).call(self, row) // eslint-disable-line
                result[key] = s
              } else {
                result[key] = value
              }
              return result
            }, {})
          })
      },
      removeTransform: function (item, index) {
        this.modelData = 'return row["' + item.sysHeader + '"]'
        this.mObj[this.activeTab].mapping[index].transformMethod = ''
        this.setTransForm()
        this.handleModalOk()
      },
      transform: function (event) {
        var targetEl = event.currentTarget
        if (targetEl.getAttribute('data-method')) {
          this.dataMethod = targetEl.getAttribute('data-method')
          if (this.dataMethod) {
            this.transformData = this.modelData + '.' + this.dataMethod
          }
        }
        return this.transformData
      },

      // ......Transform functions
      getSelectedHeaders(header,data){
        return data.filter((el) => {
          if(header == el)
          return el
        })
      },
      mapHeader(sysHeader,csvHeader){
        let self = this
        let tab = self.activeTab
        for(let i=0;i<self.mObj[tab].uploadCSV.length;i++){
           for(let key in self.mObj[tab].uploadCSV[i]){
             if(key == csvHeader){
                self.mObj[tab].newUploadCSV[i][sysHeader] = self.mObj[tab].uploadCSV[i][key]
              }
           }
         }
      },

      // Starts server side validation
      startValidation(){

        let self = this
        if(prod_info_upld == false){
          self.$Notice.error({
                   title: 'Please upload Product Information file...'
           });
        }
        else{
          self.uploadStep = false
          self.validateStep = true
          self.currentStep = 1
          $(".f-layout-copy").css("position","fixed");
          let obj2 = {
            "stepStatus": "validation_running"
          }

          api.request('get', '/uploader/'+ id).then(response => {
            uploader_obj = response.data
            api.request('patch', '/uploader/'+ id,obj2).then(res => {

                uploader_obj = res.data

              let properties1 = Object.keys(response.data)
              let properties = []
              let tab_array = ["ProductInformation","ProductPrice","ProductImprintData","ProductImage","ProductShipping","ProductAdditionalCharges","ProductVariationPrice"]
              for(let i=0;i<tab_array.length;i++){
                for(let j=0;j<properties1.length;j++){
                  if(tab_array[i] == properties1[j]){
                    properties.push(tab_array[i])
                  }
                }
              }

              prop_keys = []
              for(let i=0;i<properties.length;i++){
                if(properties[i] == "ProductInformation" || properties[i] == "ProductPrice" ||  properties[i] == "ProductImage" || properties[i] == "ProductImprintData" ||  properties[i] == "ProductShipping" || properties[i] == "ProductAdditionalCharges" ||  properties[i] == "ProductVariationPrice"){
                  self.validating = false
                  self.showValidationTable = true

                  prop_keys.push(properties[i])
                  self.val_data.push({"name":properties[i],"data":uploader_obj[properties[i]],"progress": 0})

                  self.$store.state.data = self.val_data
                  self.validation_data = false

                }
              }
              self.sheetwiseValidation(prop_keys[0],uploader_obj)
            })
          })
        }
      },

      // Validates all the sheets one by one
      sheetwiseValidation(key,data){
          let self = this
          this.$store.state.validationStatus = false
          this.$store.state.calledFromContinue = false
          let sheet_name = key.replace(/([A-Z])/g, ' $1').trim()
           validation_obj = {
            id: id,
            username: self.$store.state.user.fullname,
            user_id: self.$store.state.userId,
            sheet_name: sheet_name,
            key: key
          }
          api.request('post', '/uploader-validation/',validation_obj).then(result => {
            if(result.data.length > 0){
               self.showValidationHandson(result.data,sheet_name)
            }
            else{
              let changed_obj = _.filter(self.val_data, { 'name':prop_keys[0] });
              changed_obj[0].progress = 100
              changed_obj[0].data.validateStatus = "completed"

              uploader_obj = result.data
              prop_keys.splice(0,1)
              if(prop_keys.length != 0){
                self.sheetwiseValidation(prop_keys[0],uploader_obj)
              }
              else{
                let updated_obj = {
                  stepStatus : "validation_completed"
                }
                api.request('patch', '/uploader/'+ id,updated_obj).then(res => {
                    // this.showValidationTable = false
                    this.validation_completed = true
                })
                .catch(error =>{
                })

              }
            }
          })
          .catch(error =>{
               console.log("error......",error)
               self.sheetwiseValidation(key,data)
          })
      },

      // To show the server side validation handson
      showValidationHandson(data,sheet_name){
        let self = this
          let errcols = []
          self.error_data = []
          self.validation_err_fields = ''

          let name = sheet_name.replace(/\s/g, "")
          if(data.length != 0){
            for(let i=0;i<data[0].err_data.length;i++){
              self.error_data.push(data[0].err_data[i])
            }
          }
          self.validation_err_fields = data[0].err_fields[0].errorString
          var table = document.getElementById("valid_err")

          var validation_err = document.getElementById(name)

           var row = table.insertRow(validation_err.rowIndex + 1)
           var cell1 = row.insertCell(0);
            cell1.id = name+ "err"
            cell1.colSpan = 5
            cell1.class = "hot handsontable htColumnHeaders"


           var row1 = table.insertRow(validation_err.rowIndex + 2)
           var cell2 = row1.insertCell(0);
           cell2.id = name+ "err_msg"
           cell2.colSpan = 3
           cell2.innerHTML =  self.validation_err_fields
          if(cell2 != "" || cell2 != null || cell2 != undefined){
             cell2.style = "color:red;font-size:14px;padding-left:10px;border:0px;"
          }

           var cell3 = row1.insertCell(1);
           cell3.colSpan = 2
           cell3.innerHTML = '<button type="button" id="abortServerSide"  style="float: right;margin-right: 20px;background-color: #ed3f14;color: white;height: 32px;padding: 5px;border-radius: 5px;border-color:#ed3f14;width:15%;">Abort</button><button type="button" id="proceed-to-next"  style="float: right;margin-right: 20px;background-color: #13ce66;color: white;height: 32px;padding: 5px;border-radius: 5px;border-color: #13ce66;">Proceed To Next</button>'

           document.getElementById('proceed-to-next').onclick = function(){
             self.proceedToNext()
           }

           document.getElementById('abortServerSide').onclick = function(){
             self.AbortServerSideValidation()
           }

          _.forEach(data[0].err_data, (item,key) => {
            errcols.push({
              cols: _.indexOf(Object.keys(self.error_data[0]), data[0].err_fields[0].columnName),
              rows: key
            })
          })


          let err_row = ''
          let err_col = ''
          let err_arr = []
          var ht1 =  new Handsontable(cell1, { // eslint-disable-line
            data: self.error_data,
            colHeaders:Object.keys(self.error_data[0]),
            height: 200,
            hiddenColumns: {
              columns: [0],
              indicators: false
            },
            cells: (row, col) => {
              var cellProp = {}
              _.forEach(errcols, (value, key) => {
                if (col === value.cols && row === key) {
                  err_row = key
                  // err_row.push(key)
                  // err_row = lodash.uniqBy(err_row)
                  err_col = col

                  cellProp.className = 'error'
                }
              })

              return cellProp
            },
            afterChange: function(changes,source) {
              if(changes != null){
                self.updateProductData(changes,source,sheet_name)
              }
            }
          })

          // ht1.selectCell(err_row[0],err_col,err_row[err_row.length-1],err_col,true)
          ht1.selectCell(err_row,err_col,err_row,err_col,true)
           $(".f-layout-copy").css("position","absolute");



          // setTimeout(function(){console.log("&&&&&&&&&&&&& err array ",err_arr)

          // ht1.selectCells(err_arr)
          // ht1.selectColumns(err_col,err_col)

          self.proceedNext = true
      },

      // Updates the errors of server side validation on change
      updateProductData(changes,source,sheet_name){
        let rowindex = changes[0][0]
        let columnname = changes[0][1]
        let oldvalue = changes[0][2]
        let newvalue = changes[0][3]

        if (oldvalue != newvalue) {
        let _id = this.error_data[rowindex]._id ;    //objHandsontable.getDataAtCell(cellChange.rowIndex, 0);

        let update_obj = {
          _id : _id,
          row : rowindex,
          newValue: newvalue,
          columnname: columnname,
          sheet_name: sheet_name
        }

        api.request('patch', '/uploader-validation/'+ id,update_obj).then(res => {

        })
        .catch(error => {

        })

      }
    },

    // Hides the server side validation handson and checks for the next error if any
      proceedToNext(){
        let sheet_name = prop_keys[0].replace(/([A-Z])/g, ' $1').trim()
        let name = sheet_name.replace(/\s/g, "")
        var table = document.getElementById("valid_err")

        var validation_err = document.getElementById(name)
        table.deleteRow(validation_err.rowIndex + 1)
        table.deleteRow(validation_err.rowIndex + 1)

        $(".f-layout-copy").css("position","fixed");

        validation_obj["ruleIndex"] = uploader_obj[prop_keys[0]]["currentRuleIndex"]

        api.request('post', '/uploader-validation/',validation_obj).then(result => {

          if(result.data[0]){
            if(result.data[0].hasOwnProperty("err_data")){
             this.showValidationHandson(result.data,sheet_name)
           }
          }
          else{
            uploader_obj = result.data
            let changed_obj = _.filter(this.val_data, {'name':prop_keys[0]});
            changed_obj[0].progress = 100
            changed_obj[0].data.validateStatus = "completed"


            self.proceedNext = false
            uploader_obj = result.data
            prop_keys.splice(0,1)
            if(prop_keys.length != 0){
              this.sheetwiseValidation(prop_keys[0],uploader_obj)
            }
            else{
              let updated_obj = {
                stepStatus : "validation_completed"
              }
              api.request('patch', '/uploader/'+ id,updated_obj).then(res => {

                // this.showValidationTable = false
                // this.$store.state.data = []
                this.validation_completed = true
              })
            }
          }
        })
        .catch(error => {
           this.proceedToNext()
        })

      },

      // Puts a entry in the jobqueue
      importToPDM(){

        let jobQueue_obj = {
          "importTrackerId":id
        }

              api.request('post', '/import-to-jobqueue/',jobQueue_obj).then(res => {
                if(res.data){
                     this.showValidationTable = false
                     this.validation_completed = false
                     this.validation_data = true
                     this.validateStep = false
                     this.importStep = true
                     this.currentStep = 2
                     if(this.abortImportBtn == true){
                       this.abortImportBtn = false
                     }
                }

              })
              .catch(error => {
                if(error.response.data.className == 'general-error'){
                  self.$Notice.error({
                    title: error.response.data.message,
                    desc: "Please try again..."
                  })
                }
               else {
                 this.$Notice.error({
                  title: 'Error in importing data'
                });
               }
               })

        //
      },
      convert(item){
        item = item.replace(/([A-Z])/g, ' $1').trim()
        return item
      },

      // put an entry in the jobqueue and changes the uploader status to import_to_confirm_in_progress
      importToConfirm(){
        this.abortImportBtn = false
        let jobQueue_obj = {
          "importTrackerId":id
        }

        api.request('post', '/import-to-confirm/',jobQueue_obj).then(res => {
          if(res.data){
            self.importBtn = false
          }
        })
        .catch(error => {
          if(error.response.data.className == 'general-error'){
            self.importBtn = true
            self.$Notice.error({
              title: error.response.data.message,
              desc: "Please try again..."
            })
          }
         else{
           this.$Notice.error({
            title: 'Error in import to confirm'
          });
         }

        })

        // let importobj = {
        //   'stepStatus': "import_to_confirm_in_progress"
        // }
        //
        // api.request('patch', '/uploader/' + id,importobj).then(result => {
        //   this.importBtn = false
        // })
        // .catch(error => {
        //     this.$Notice.error({
        //      title: 'Error'
        //    });
        // })
      },
      mapType(sysHeader,type){

      },
      changeSchema(tab,value){
        if(value == "--Add new--"){
          this.proceedBtn = true
          this.mObj[tab].display = true
          this.mObj[tab].new_flag = 1
          if(this.mObj[tab].uploadDisplay){
            this.mObj[tab].headerDisplay = false
            this.mObj[tab].newSchemaDisplay = false
          }
          else{
            this.mObj[tab].headerDisplay = false
            this.mObj[tab].newSchemaDisplay = true
          }

          if(tab == 'Product Information'){
            this.mObj[tab].schema = ProductInformationSchema
          }
          else if(tab == 'Product Price'){
            this.mObj[tab].schema = ProductPricingSchema
          }
          else if(tab == 'Product Imprint Data'){
            this.mObj[tab].schema = ProductImprintDataSchema
          }
          else if(tab == 'Product Image'){
            this.mObj[tab].schema = ProductImagesSchema
          }
          else if(tab == 'Product Shipping'){
            this.mObj[tab].schema = ProductShippingSchema
          }
          else if(tab == 'Product Additional Charges'){
            this.mObj[tab].schema = ProductAdditionalChargesSchema

          }
          else if(tab == 'Product Variation Price'){
            this.mObj[tab].schema = ProductVariationSchema

          }

          let mapObj = this.generateHeadersandMapping(tab)

        }
        else{
          // this.loadingdot = true
          //
          let currentSelectedSchema = this.mObj[tab].selected_schema
          this.existingSchemaData = []
          socket.emit('uploader-schema::find', {"subscriptionId":this.$store.state.subscription_id,"import_tracker_id":id}, (e, res) => {
            if(res){
              this.existingSchemaData = res.data
              let currentschema = _.filter(this.existingSchemaData, function(o) { return o.name == currentSelectedSchema; });
              if(currentschema.length != 0){

                schema_id = currentschema[0].id
                this.mObj[tab].schema = new Schema(currentschema[0].schema)

                this.mObj[tab].display = false

                if(this.mObj[tab].uploadDisplay){
                  this.mObj[tab].newSchemaDisplay = false
                  this.mObj[tab].headerDisplay = false
                }
                else if(this.mObj[tab].savePreviewDisplay && !this.mObj[tab].headerDisplay && !this.mObj[tab].newSchemaDisplay){
                  this.mObj[tab].newSchemaDisplay = false
                  this.mObj[tab].headerDisplay = false
                }
                else{
                  this.mObj[tab].newSchemaDisplay = false
                  this.mObj[tab].headerDisplay = true
                }
                this.getMapping(tab)
              }
            }
            else{
                this.$Notice.error({
                 title: e.response.data.message
               });
            }
          })


        }
      },
      async getMapping(tab){
        let self = this

         if(this.mObj[tab].selected_schema != '--Add new--'){
           if(self.mObj[tab].new_flag == 1){
             self.mObj[tab].new_flag = 0
           }

           if(this.mObj[tab].headerDisplay == true){
             this.mObj[tab].headerDisplay = false
           }
          this.loadingdot = true
          this.map = true
          this.mObj[tab].mapping = []

           socket.emit('uploader-csv-file-mapping::find', {"fileTypeId" : this.mObj[tab].selected_schema,"subscriptionId":this.$store.state.subscription_id,"import_tracker_id":id},async (e, data) => {
             if(data){
               this.mObj[tab].mapping = data.data[0].mapping
               let schema_keys = _.keys(this.mObj[tab].schema.structure);
               if(this.mObj[tab].uploadCSV.length != 0){
                 this.mObj[tab].newUploadCSV = []
                 for(let i=0;i<this.mObj[tab].uploadCSV.length;i++){
                   let obj = {}
                   for(let key in this.mObj[tab].uploadCSV[i]){
                     for(let j=0;j<this.mObj[tab].mapping.length;j++){
                       if(this.mObj[tab].mapping[j].csvHeader == key){
                         obj[this.mObj[tab].mapping[j].sysHeader] = this.mObj[tab].uploadCSV[i][key]
                       }
                       else if(!obj.hasOwnProperty(this.mObj[tab].mapping[j].sysHeader)){
                         obj[this.mObj[tab].mapping[j].sysHeader] = ''
                       }
                     }
                   }
                   obj["_id"] = uuidV1()
                  //  await self.validateObj(schema_Obj,obj,tab,errcols,i)
                   this.mObj[tab].newUploadCSV.push(obj)

                   this.mObj[tab].load = false
                   $(".f-layout-copy").css("position","absolute");
                   if(this.mObj[tab].savePreviewDisplay == false && this.mObj[tab].load == false && this.mObj[tab].errDisplay == false){
                     self.mObj[tab].previewDisplay = true
                     self.mObj[tab].headerDisplay = true
                   }
                   this.loadingdot = false
                 }


                 let index = this.mObj[tab].newUploadCSV.length - 1
                //  this.mObj[tab].newUploadCSV.splice(index, 1)
                 this.mObj[tab].csv_arr = this.mObj[tab].newUploadCSV

                 for(let k=0;k<this.mObj[tab].mapping.length;k++){
                   if(this.mObj[tab].mapping[k].transform != ""){
                     this.transformData = this.mObj[tab].mapping[k].transform
                     this.modelIndex = k
                     this.handleModalOk()
                   }
                 }
               }
               else{
                 this.loadingdot = false
               }
             }
             else{
               this.$Notice.error({
                title: e.response.data.message
              });
             }

           })
         }
         else if(this.mObj[tab].selected_schema == '--Add new--'){
           this.mObj[tab].display = true
         }
      },
      validateSchema(tab,schema){
        if(schema == '' || schema == null){
          this.proceedBtn = true
          this.$Notice.error({
                 title: 'Empty values not allowed',
                 duration: 5
             });
        }
        else if(schema == 'Untitled mapping' || schema == '--Add new--'){
          this.proceedBtn = true
          this.$Notice.error({
                 title: 'Please write new mapping name',
                 duration: 5
             });
        }
        else{
          let flag = false
          for(let i=0;i<this.mObj[tab].schemaList.length;i++){
            if(this.mObj[tab].schemaList.value == schema){
              this.$Notice.error({
                     title: 'This mapping name already exists',
                     duration: 5
                 });
              this.proceedBtn = true
              flag = true
            }
          }
          if(flag == false){

             this.mObj[tab].poptip_display = false
             this.mObj[tab].display = false
             this.mObj[tab].schemaList.push({"value" : schema,"label": schema})
             this.mObj[tab].schemaList = lodash.orderBy(this.mObj[tab].schemaList, 'value', 'asc');
             let new_index = lodash.findIndex(this.mObj[tab].schemaList, function(o) { return o.value == '--Add new--'; });
             this.mObj[tab].schemaList.splice(this.mObj[tab].schemaList.length-1,0,this.mObj[tab].schemaList.splice(new_index,1)[0]);
             this.mObj[tab].selected_schema = schema
             this.mObj[tab].new_flag = 1

          }
        }
      },
    //   upldCSV(tab){
    //     let self = this
    //
    //     $(document).ready(function () {
    //       $('#csv-file').bind("change",function () {
    //         let fileChooser = document.getElementById('csv-file')
    //         file = fileChooser.files[0]
    //
    //         let file_ext = file.name.split('.').pop()
    //         if(file_ext != 'csv'){
    //           self.$Notice.error({title: 'Only CSV files are allowed',duration: 20})
    //         }
    //         else{
    //           self.mObj[tab].load = true
    //           self.mObj[tab].uploadDisplay = false
    //             Papa.parse(file, {
    //               header: true,
    //               dynamicTyping: true,
    //               encoding: "UTF-8",
    //               skipEmptyLines: false,
    //               chunk: function(results, streamer){
    //                 self.mObj[tab].uploadCSV = results.data
    //                 self.mObj[tab].headers = Object.keys(self.mObj[tab].uploadCSV[0])
    //                 self.mObj[tab].headers.push("_id")
    //                 if(self.mObj[tab].new_flag == 1){
    //
    //                   self.mObj[tab].load = true
    //                   self.mObj[tab].mapping = []
    //                   self.generateHeadersandMapping(tab)
    //                 }
    //                 else{
    //
    //                   self.mObj[tab].load = true
    //                   if(self.mObj[tab].newSchemaDisplay == true){
    //                     self.mObj[tab].newSchemaDisplay = false
    //                   }
    //
    //
    //                   self.mObj[tab].mapping = []
    //
    //                   self.getMapping(tab)
    //                   // self.mObj[tab].previewDisplay = true
    //                   // self.mObj[tab].headerDisplay = true
    //                 }
    //               }
    //             })
    //
    //         }
    //
    //         })
    //         $('#csv-file').unbind("change",function () {})
    //         })
    // },
    generateHeadersandMapping(tab){
      let self = this
      self.map = false
      let schema_keys = _.keys(self.mObj[tab].schema.structure);
      self.mObj[tab].newUploadCSV = []

      // errcols = []
      // err_length = 0
      // self.mObj[tab].data1 = []
      // self.mObj[tab].headers1 = []
      // self.mObj[tab].errmsg = []
      // schema_Obj = await this.makeSchemaObj(tab)

      if(self.mObj[tab].uploadCSV.length != 0){
        self.loadingdot = true

        for(let i=0;i<self.mObj[tab].uploadCSV.length;i++){
          let obj = {}
           for(let key in self.mObj[tab].uploadCSV[i]){

             for(let j=0;j<schema_keys.length;j++){
               if(schema_keys[j] == key.toLowerCase()){
                   obj[schema_keys[j]] = self.mObj[tab].uploadCSV[i][key]
               }
               else if(!obj.hasOwnProperty(schema_keys[j])){
                    obj[schema_keys[j]] = ''
               }
             }
           }
           obj["_id"] = uuidV1()
           self.mObj[tab].newUploadCSV.push(obj)

           self.mObj[tab].newSchemaDisplay = true
           self.mObj[tab].previewDisplay = true
           self.mObj[tab].load = false
           $(".f-layout-copy").css("position","absolute");
           self.loadingdot = false
        }

          // for(let i=0;i<self.mObj[tab].uploadCSV.length;i++){
          //   let obj = {}
          //    for(let key in self.mObj[tab].uploadCSV[i]){
          //
          //      for(let j=0;j<schema_keys.length;j++){
          //        if(schema_keys[j] == key.toLowerCase()){
          //            obj[schema_keys[j]] = self.mObj[tab].uploadCSV[i][key]
          //        }
          //        else if(!obj.hasOwnProperty(schema_keys[j])){
          //             obj[schema_keys[j]] = ''
          //        }
          //      }
          //    }
          //    obj["_id"] = uuidV1()
          //    self.mObj[tab].newUploadCSV.push(obj)
          //    self.mObj[tab].newSchemaDisplay = true
          //    self.mObj[tab].previewDisplay = true
          //    self.mObj[tab].load = false
          //    $(".f-layout-copy").css("position","absolute");
          //    self.loadingdot = false
          // }
            // let index = self.mObj[tab].newUploadCSV.length - 1
            // self.mObj[tab].newUploadCSV.splice(index,1)
            self.mObj[tab].csv_arr = self.mObj[tab].newUploadCSV

            self.mObj[tab].mapping =[]
            for(let key in self.mObj[tab].schema.structure){
              self.mObj[tab].mapping.push({'sysHeader':key,"schemaObj": self.mObj[tab].schema.structure[key],"csvHeader":"","transform":"","transformMethod":""})
            }

            for(var i=0;i<self.mObj[tab].headers.length;i++){

               if(_.findIndex(self.mObj[tab].mapping, {'sysHeader': self.mObj[tab].headers[i].toLowerCase()}) != -1){
                 let index =_.findIndex(self.mObj[tab].mapping, {'sysHeader':  self.mObj[tab].headers[i].toLowerCase()})

                 self.mObj[tab].mapping[index]['csvHeader'] = self.mObj[tab].headers[i]
               }
            }

            // for(let i=0;i<self.mObj[tab].headers.length;i++){
            //   for(let j=0;j<self.mObj[tab].mapping.length;j++){
            //     if(self.mObj[tab].mapping[j]['csvHeader'] == ""){
            //       if(self.mObj[tab].headers[i].toLowerCase().indexOf(self.mObj[tab].mapping[j]['sysHeader']) != -1){
            //         self.mObj[tab].mapping[j]['csvHeader'] = self.mObj[tab].headers[i]
            //       }
            //     }
            //   }
            // }
            return self.mObj[tab].mapping;
        }
        else{
           self.loadingdot = false
        }
    },
    mapHeaders(tab){
      map_flag = false
      this.modal1 = false
      this.proceedBtn = true
      this.ProceedLoading = false
      continue_flag = false
    },
   async continuee(tab){
      // this.loadProcessing = true
      continue_flag = true
      this.showContinue = false
      this.proceedBtn = true
      let self = this
      await self.saveSchemaandMapping(tab)
      await self.parseFile(tab)
      // await self.makeNewUploadCSVObj(tab)
      // await self.transformFromMapping(tab)
      self.modal1 = false
      self.ProceedLoading = true
      // self.ProceedToValidate(tab)
    },
    cancel (){
      this.proceedBtn = true
      continue_flag = false
    },
    transformFromMapping(tab) {
      return new Promise(async (resolve,reject)=>{
      this.mObj[tab].csv_arr = this.mObj[tab].newUploadCSV
       for(let k=0;k<this.mObj[tab].mapping.length;k++){
         if(this.mObj[tab].mapping[k].transform != ""){
           this.transformData = this.mObj[tab].mapping[k].transform
           this.modelIndex = k
           this.handleModalOk()
         }
       }
       resolve('done')
     })
    },
    async makeNewUploadCSVObj(tab){
      return new Promise(async (resolve,reject)=>{
      let self = this
      self.mObj[tab].newUploadCSV = []
      self.mObj[tab].csv_arr = []

      for(let i=0 ;i<self.mObj[tab].uploadCSV.length;i++){
        let obj = {}
         for(let key in self.mObj[tab].uploadCSV[i]){

           for(let j=0;j<self.mObj[tab].mapping.length;j++){
             if(self.mObj[tab].mapping[j]["csvHeader"] == key){
                 obj[self.mObj[tab].mapping[j]["sysHeader"]] = self.mObj[tab].uploadCSV[i][key]
             }
             else if(!obj.hasOwnProperty(self.mObj[tab].mapping[j]["sysHeader"])){
                  obj[self.mObj[tab].mapping[j]["sysHeader"]] = ''
             }
           }
         }
         obj["_id"] = uuidV1()
         self.mObj[tab].newUploadCSV.push(obj)

         this.mObj[tab].csv_arr = this.mObj[tab].newUploadCSV

         // for(let k=0;k<this.mObj[tab].mapping.length;k++){
         //   if(this.mObj[tab].mapping[k].transform != ""){
         //     this.transformData = this.mObj[tab].mapping[k].transform
         //     this.modelIndex = k
         //     this.handleModalOk()
         //   }
         // }
      }
      // return;
      resolve('done')
    })
    },
    async Proceed(tab){
      let self = this
      // $(".f-layout-copy").css("position","fixed");

      // self.proceedBtn = false
        if(map_flag == false){
          let check_headers = _.filter(self.mObj[tab].mapping, function(o) {
            if(o.schemaObj.optional == false && o.csvHeader == ""){
              return o.csvHeader == "";
            }
          });
          if(check_headers.length != 0){
              self.modal1 = true
          }
          else{
             self.showContinue = true
             if(continue_flag == false){
               let optional_headers = _.filter(self.mObj[tab].mapping, function(o) {
                 if(o.schemaObj.optional == true && o.csvHeader == ""){
                   return o.csvHeader == "";
                 }
               });
               if(optional_headers.length != 0){
                   self.modal1 = true
                   continue_flag = true
               }
               else{
                  // self.loadProceed = true
                    self.ProceedLoading = true
                    await self.saveSchemaandMapping(tab)
                    await self.parseFile(tab)
               }
             }
             else{

               // self.loadProceed = true
                 self.ProceedLoading = true
                 await self.saveSchemaandMapping(tab)
                 await self.parseFile(tab)
             }
          }
        }
        else{
          // self.loadProceed = true
            self.ProceedLoading = true
            await self.saveSchemaandMapping(tab)
            await self.parseFile(tab)
        }
    },
    // makeSchemaObj(tab){
    //   console.log("++++++++makeSchemaObj called ++++++")
    //   let self = this
    //   // let errcols = []
    //   let dateValidatorFunc = function (obj, value,fieldName) {
    //           if(value != "" || value != undefined){
    //            let date = moment(value)
    //            let isValid = date.isValid()
    //            if (isValid != true) return 'Invalid date. Please provide date in y-m-d format'
    //            date._d = moment(new Date(date._d)).format('YYYY/MM/DD')
    //            return
    //          }
    //   }
    //   let urlValidatorFunc = function (obj, value, fieldName) {
    //
    //             if (value != "" || value != undefined) {
    //               let re = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/
    //               if(re.test(value) !== true)
    //               return 'Invalid url'
    //               else
    //               return
    //             }
    //           }
    //
    //   let emailValidatorFunc = function (obj, value, fieldName) {
    //     if(value !== undefined || value !== ""){
    //       let re = /\S+@\S+\.\S+/
    //       if(re.test(value) !== true)
    //       return  'Invalid email address'
    //       else
    //       return
    //     }
    //   }
    //
    //   let optionalValidatorFunc = function (obj, value, fieldName) {
    //     if(value == '')
    //       return  fieldName + ' cannot be left blank'
    //       else
    //       return
    //
    //   }
    //
    //
    //   let phoneValidatorFunc = function (obj, value, fieldName) {
    //     let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im // eslint-disable-line
    //     if (value !== undefined || value !== "") {
    //       if(re.test(value) !== true)
    //       return 'Invalid phone number'
    //       else
    //       return
    //     }
    //   }
    //
    //   let pincodeValidatorFunc = function (obj, value, fieldName) {
    //     let re = /^[0-9]{1,6}$/ // eslint-disable-line
    //     if (value !== undefined || value !== "") {
    //       if(re.test(value) !== true)
    //       return 'Invalid pin-code'
    //       else
    //       return
    //     }
    //   }
    //
    //   let getFunctionDate = function (obj, value, fieldName) {
    //     var func1 = allowedValueValidatorFunc(obj, value, fieldName)
    //     var func2 = regExValidatorFunc(obj, value, fieldName)
    //     var func3 = dateValidatorFunc(obj, value, fieldName)
    //     var func4 =  defaultValidatorFunc(obj, value, fieldName)
    //     var func5 = optionalValidatorFunc(obj,value,fieldName)
    //     if (func1 !== undefined) {
    //       return func1
    //     } else if (func2 !== undefined) {
    //       return func2
    //     } else if (func3 !== undefined) {
    //       return func3
    //     } else if(func4 !== undefined){
    //       return func4
    //     }else if(func5 !== undefined){
    //       return func5
    //     }else {
    //       return
    //     }
    //   }
    //
    //   let getFunctionUrl = function (obj, value, fieldName) {
    //     var func1 = allowedValueValidatorFunc(obj, value, fieldName)
    //     var func2 = regExValidatorFunc(obj, value, fieldName)
    //     var func3 = urlValidatorFunc(obj, value, fieldName)
    //     var func4 = defaultValidatorFunc(obj, value, fieldName)
    //     var func5 = optionalValidatorFunc(obj,value,fieldName)
    //     if (func1 !== undefined) {
    //       return func1
    //     } else if (func2 !== undefined) {
    //       return func2
    //     } else if (func3 !== undefined) {
    //       return func3
    //     } else if(func4 !== undefined){
    //       return func4
    //     }else if(func5 !== undefined){
    //       return func5
    //     }else {
    //       return
    //     }
    //   }
    //
    //   let getFunctionEmail = function (obj, value, fieldName) {
    //     var func1 = allowedValueValidatorFunc(obj, value, fieldName)
    //     var func2 = regExValidatorFunc(obj, value, fieldName)
    //     var func3 = emailValidatorFunc(obj, value, fieldName)
    //     var func4 = defaultValidatorFunc(obj, value, fieldName)
    //     var func5 = optionalValidatorFunc(obj,value,fieldName)
    //     if (func1 !== undefined) {
    //       return func1
    //     } else if (func2 !== undefined) {
    //       return func2
    //     } else if (func3 !== undefined) {
    //       return func3
    //     } else if(func4 !== undefined){
    //       return func4
    //     }else if(func5 !== undefined){
    //       return func5
    //     }else {
    //       return
    //     }
    //   }
    //
    //   let getFunctionPhone = function (obj, value, fieldName) {
    //     var func1 = allowedValueValidatorFunc(obj, value, fieldName)
    //     var func2 = regExValidatorFunc(obj, value, fieldName)
    //     var func3 = phoneValidatorFunc(obj, value, fieldName)
    //     var func4 = defaultValidatorFunc(obj, value, fieldName)
    //     var func5 = optionalValidatorFunc(obj,value,fieldName)
    //     if (func1 !== undefined) {
    //       return func1
    //     } else if (func2 !== undefined) {
    //       return func2
    //     } else if (func3 !== undefined) {
    //       return func3
    //     } else if(func4 !== undefined){
    //       return func4
    //     }else if(func5 !== undefined){
    //       return func5
    //     }else {
    //       return
    //     }
    //   }
    //
    //   let getFunctionPincode = function (obj, value, fieldName) {
    //     var func1 = allowedValueValidatorFunc(obj, value, fieldName)
    //     var func2 = regExValidatorFunc(obj, value, fieldName)
    //     var func3 = getFunctionPincode(obj, value, fieldName)
    //     var func4 = defaultValidatorFunc(obj, value, fieldName)
    //     var func5 = optionalValidatorFunc(obj,value,fieldName)
    //     if (func1 !== undefined) {
    //       return func1
    //     } else if (func2 !== undefined) {
    //       return func2
    //     } else if (func3 !== undefined) {
    //       return func3
    //     } else if(func4 !== undefined){
    //       return func4
    //     }else if(func5 !== undefined){
    //       return func5
    //     }else {
    //       return
    //     }
    //   }
    //
    //   let getFunctionText = function (obj, value, fieldName) {
    //     var func1 = allowedValueValidatorFunc(obj, value, fieldName)
    //     var func2 = regExValidatorFunc(obj, value, fieldName)
    //     var func3 = defaultValidatorFunc(obj, value, fieldName)
    //     var func4 = maxLengthValidatorFunc(obj, value, fieldName)
    //     var func5 = optionalValidatorFunc(obj,value,fieldName)
    //     if (func1 !== undefined) {
    //       return func1
    //     } else if (func2 !== undefined) {
    //       return func2
    //     } else if (func3 !== undefined){
    //         return func3
    //     } else if(func4 !== undefined){
    //        return func4
    //     }else if(func5 !== undefined){
    //        return func5
    //     }else {
    //       return
    //     }
    //   }
    //
    //   let allowedValueValidatorFunc = function (obj, value, fieldName) {
    //     var i
    //     _.forEach(Object.keys(self.mObj[self.activeTab].schema.structure), function (value, key) {
    //       if (fieldName === value) {
    //         i = key
    //       }
    //     })
    //     if (self.mObj[self.activeTab].mapping[i].schemaObj.allowedValues.length > 0) {
    //       if (value !== undefined) {
    //         let check = _.includes(self.mObj[self.activeTab].mapping[i].schemaObj.allowedValues, value)
    //         if(check != true)
    //         return  'System allowedvalues are ' + self.mObj[self.activeTab].mapping[i].schemaObj.allowedValues
    //         else {
    //           return
    //         }
    //       }
    //     }
    //   }
    //
    //   let defaultValidatorFunc = function (obj, value, fieldName) {
    //
    //     var i
    //     _.forEach(Object.keys(self.mObj[self.activeTab].schema.structure), function (value, key) {
    //       if (fieldName === value) {
    //         i = key
    //       }
    //     })
    //     if (self.mObj[self.activeTab].mapping[i].schemaObj.defaultValue !== '' && self.mObj[self.activeTab].mapping[i].schemaObj.defaultValue !== undefined ) {
    //
    //       if (value == "")
    //         return  'default value should be ' + self.mObj[self.activeTab].mapping[i].schemaObj.defaultValue
    //         else
    //           return
    //       }
    //     }
    //
    //     let maxLengthValidatorFunc = function (obj, value, fieldName) {
    //
    //       var i
    //       _.forEach(Object.keys(self.mObj[self.activeTab].schema.structure), function (value, key) {
    //         if (fieldName === value) {
    //           i = key
    //         }
    //       })
    //       if (self.mObj[self.activeTab].mapping[i].schemaObj.maxLength !== '') {
    //         if (value !== undefined && typeof(value) == "string") {
    //           let check = value.length
    //           if(check != self.mObj[self.activeTab].mapping[i].schemaObj.maxLength)
    //           return  'maxLength value should be' + self.mObj[self.activeTab].mapping[i].schemaObj.maxLength
    //           else {
    //             return
    //           }
    //         }
    //       }
    //       }
    //
    //   let regExValidatorFunc = function (obj, value, fieldName) {
    //     var i
    //     _.forEach(Object.keys(self.mObj[self.activeTab].schema.structure), function (value, key) {
    //       if (fieldName === value) {
    //         i = key
    //       }
    //     })
    //     if (self.mObj[self.activeTab].mapping[i].schemaObj.regEx !== '') {
    //       if (value !== undefined) {
    //         let pttrn = new RegExp(self.mObj[self.activeTab].mapping[i].schemaObj.regEx)
    //         if (pttrn.test(value) === false && fieldName == 'max_imprint_color_allowed'){
    //           return 'Decimal value not allowed'
    //         }
    //         else if(pttrn.test(value) === false && fieldName != 'max_imprint_color_allowed'){
    //           return  'Value does not match with the regex'
    //         }
    //       }
    //     }
    //   }
    //
    //
    //     let schema_Obj = {}
    //     _.forEach(self.mObj[tab].mapping, function (value, key) {
    //       console.log("mapping loop started ========")
    //       if(value.schemaObj.optional == true){
    //           if(value.schemaObj.type == 'date'){
    //             schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: dateValidatorFunc,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
    //           }
    //           else if(value.schemaObj.type == 'url'){
    //             schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: urlValidatorFunc,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
    //           }
    //           else if (value.schemaObj.type == 'email') {
    //             schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: emailValidatorFunc,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
    //           }
    //           else if (value.schemaObj.type == 'phone') {
    //             schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: phoneValidatorFunc,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
    //           }
    //           else if (value.schemaObj.type == 'pin-code') {
    //             schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: pincodeValidatorFunc,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
    //           }
    //           else{
    //             schema_Obj[value.sysHeader] = {type: value.schemaObj.type,validator:regExValidatorFunc,label: value.schemaObj.type,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
    //           }
    //       }
    //       else if(value.schemaObj.optional == false) {
    //         if(value.schemaObj.type == 'date'){
    //           schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: getFunctionDate,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
    //         }
    //         else if(value.schemaObj.type == 'url'){
    //           schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: getFunctionUrl,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
    //         }
    //         else if (value.schemaObj.type == 'email') {
    //           schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: getFunctionEmail,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
    //         }
    //         else if (value.schemaObj.type == 'phone') {
    //           schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: getFunctionPhone,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
    //         }
    //         else if (value.schemaObj.type == 'pin-code') {
    //           schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: getFunctionPincode,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
    //         }
    //         else{
    //           schema_Obj[value.sysHeader] = {type: value.schemaObj.type,label: value.schemaObj.type,validator: getFunctionText,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
    //         }
    //       }
    //     })
    //
    //     return schema_Obj
    // },
 parseFile(tab){
    let self = this
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        encoding: "UTF-8",
        skipEmptyLines: true,
        chunk: async function(results, streamer) {
            if(results.data.length != 0){
              totalRecords = totalRecords + results.data.length
              streamer.pause()
              self.mObj[tab].uploadCSV = []
              self.mObj[tab].uploadCSV = results.data
              await self.makeNewUploadCSVObj(tab)
              await self.transformFromMapping(tab)
              globalValidateResolve = null
              await self.ProceedToValidate(tab)
              await self.saveData(tab)
              await self.socketResponse()
              if(streamer.paused()) {
                streamer.resume()
              }
              if(complete_flag == false){
                complete_flag = true
                await self.changeStatus(tab)
              }

            }
        },
        complete:async function(results, file) {
          complete_flag = false
          // if(self.mObj[tab].complete_flag == false){
          //   self.mObj[tab].complete_flag = true
          //
          // }
        }
        })
    },
    socketResponse(){
      return new Promise(async (resolve,reject)=>{
        socket.removeListener('response');
        socket.removeListener('err');

        socket.on('response', (response) => {
          if(response.stdout.ok == 1){
            resolve(response)
          }
        })
        socket.on('err',(response) => {
          this.$Notice.error({title: 'Error!', desc: response.stdout})
        })
      })
    },
    changeStatus(tab){
      if(this.mObj[tab].complete_flag == false){
        let Tab = tab.replace(/\s/g, "")
        obj1[Tab]["totalNoOfRecords"] = totalRecords
        this.mObj[tab].complete_flag = true
        api.request('patch', '/uploader/' + id,obj1).then(res => {
          let self = this
          this.ProceedLoading = false
          this.proceedBtn = true
          totalRecords = 0
         })
         .catch(error => {
             this.$Notice.error({title: 'Error!', desc: 'Error in saving the data!'})
         })
       }
    },
    saveSchemaandMapping(tab){
      let self = this
      let CSVFileObj = {
        name : file.name,
        size: file.size,
        username: self.$store.state.user.email,
        subscriptionId: self.$store.state.subscription_id,
        import_tracker_id: id
      }

      let name = tab.replace(/\s/g, "")
      obj1 = {}
      obj1[name] = {
        uploadStatus:"completed",
        validateStatus: "pending",
        uploadedAt: new Date()
        // totalNoOfRecords: self.mObj[tab].newUploadCSV.length
      }

      if(self.mObj[tab].new_flag == 1){
        let schemaobj = {
          name : self.mObj[tab].selected_schema,
          schema: self.mObj[tab].schema.structure,
          username: self.$store.state.user.email,
          subscriptionId: self.$store.state.subscription_id,
          import_tracker_id: id,
          tabname: tab
        }

        api.request('post', '/uploader-schema/',schemaobj).then(res => {

            schema_id = res.data.id

            api.request('post', '/uploader-csv-files/',CSVFileObj).then(result => {
              CSVFile_id = result.data.id

              let mappingObj = {
                mapping : self.mObj[tab].mapping,
                fileTypeId : self.mObj[tab].selected_schema,
                username : self.$store.state.user.email,
                subscriptionId: self.$store.state.subscription_id,
                import_tracker_id:id
              }

              api.request('post', '/uploader-csv-file-mapping/' ,mappingObj).then(response => {
              obj1[name]["id"] = CSVFile_id
              obj1[name]["schema_id"] = schema_id
              })
              .catch(error => {
                  self.$Notice.error({title: error.response.data.message })
              })

            })
            .catch(error => {
              self.$Notice.error({title: error.response.data.message })
            })
        })
        .catch(error => {
          if(error.response.data.className == 'general-error' && error.response.data.code == 500)
            self.$Notice.error({title: error.response.data.message })
          else
            self.$Notice.error({title: error.response.data.message })
           })

      }
      else {
        api.request('post', '/uploader-csv-files/',CSVFileObj).then(result => {
          CSVFile_id = result.data.id
          obj1[name]["id"] = CSVFile_id
          obj1[name]["schema_id"] = schema_id
      })
      .catch(error => {
          self.$Notice.error({title: error.response.data.message })
      })
    }
    },
    ProceedToValidate(tab){
      return new Promise(async (resolve,reject)=> {
        let globalValidateResolveFlag = true
        if (globalValidateResolve === null) {
          globalValidateResolveFlag = false
          globalValidateResolve = resolve;
        }
      let self = this
      map_flag = false

      if(self.mObj[tab].selected_schema == '--Add new--'){
        self.proceedBtn = true
        self.$Notice.error({title: 'Please enter a valid mapping name',duration: 5})
      }
      else {
      continue_flag = false
      self.showContinue = false
      let errcols = []
      if(load_flag == false){
        self.mObj[tab].load = true
      }
      let dateValidatorFunc = function (obj, value, fieldName) {
              if(value != "" || value != undefined){
               let date = moment(value)
               let isValid = date.isValid()
               if (isValid != true) return 'Invalid date. Please provide date in y-m-d format'
               date._d = moment(new Date(date._d)).format('YYYY/MM/DD')
               return
             }
      }
      let urlValidatorFunc = function (obj, value, fieldName) {

                if (value != "" || value != undefined) {
                  let re = /^((http[s]?|ftp):\/)?\/?([^:\/\s]+)((\/\w+)*\/)([\w\-\.]+[^#?\s]+)(.*)?(#[\w\-]+)?$/
                  if(re.test(value) !== true)
                  return 'Invalid url'
                  else
                  return
                }
              }

      let emailValidatorFunc = function (obj, value, fieldName) {
        if(value !== undefined || value !== ""){
          let re = /\S+@\S+\.\S+/
          if(re.test(value) !== true)
          return  'Invalid email address'
          else
          return
        }
      }

      let optionalValidatorFunc = function (obj, value, fieldName) {
        if(value == '')
          return  fieldName + ' cannot be left blank'
          else
          return

      }


      let phoneValidatorFunc = function (obj, value, fieldName) {
        let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im // eslint-disable-line
        if (value !== undefined || value !== "") {
          if(re.test(value) !== true)
          return 'Invalid phone number'
          else
          return
        }
      }

      let pincodeValidatorFunc = function (obj, value, fieldName) {
        let re = /^[0-9]{1,6}$/ // eslint-disable-line
        if (value !== undefined || value !== "") {
          if(re.test(value) !== true)
          return 'Invalid pin-code'
          else
          return
        }
      }

      let getFunctionDate = function (obj, value, fieldName) {
        var func1 = allowedValueValidatorFunc(obj, value, fieldName)
        var func2 = regExValidatorFunc(obj, value, fieldName)
        var func3 = dateValidatorFunc(obj, value, fieldName)
        var func4 =  defaultValidatorFunc(obj, value, fieldName)
        var func5 = optionalValidatorFunc(obj,value,fieldName)
        if (func1 !== undefined) {
          return func1
        } else if (func2 !== undefined) {
          return func2
        } else if (func3 !== undefined) {
          return func3
        } else if(func4 !== undefined){
          return func4
        }else if(func5 !== undefined){
          return func5
        }else {
          return
        }
      }

      let getFunctionUrl = function (obj, value, fieldName) {
        var func1 = allowedValueValidatorFunc(obj, value, fieldName)
        var func2 = regExValidatorFunc(obj, value, fieldName)
        var func3 = urlValidatorFunc(obj, value, fieldName)
        var func4 = defaultValidatorFunc(obj, value, fieldName)
        var func5 = optionalValidatorFunc(obj,value,fieldName)
        if (func1 !== undefined) {
          return func1
        } else if (func2 !== undefined) {
          return func2
        } else if (func3 !== undefined) {
          return func3
        } else if(func4 !== undefined){
          return func4
        }else if(func5 !== undefined){
          return func5
        }else {
          return
        }
      }

      let getFunctionEmail = function (obj, value, fieldName) {
        var func1 = allowedValueValidatorFunc(obj, value, fieldName)
        var func2 = regExValidatorFunc(obj, value, fieldName)
        var func3 = emailValidatorFunc(obj, value, fieldName)
        var func4 = defaultValidatorFunc(obj, value, fieldName)
        var func5 = optionalValidatorFunc(obj,value,fieldName)
        if (func1 !== undefined) {
          return func1
        } else if (func2 !== undefined) {
          return func2
        } else if (func3 !== undefined) {
          return func3
        } else if(func4 !== undefined){
          return func4
        }else if(func5 !== undefined){
          return func5
        }else {
          return
        }
      }

      let getFunctionPhone = function (obj, value, fieldName) {
        var func1 = allowedValueValidatorFunc(obj, value, fieldName)
        var func2 = regExValidatorFunc(obj, value, fieldName)
        var func3 = phoneValidatorFunc(obj, value, fieldName)
        var func4 = defaultValidatorFunc(obj, value, fieldName)
        var func5 = optionalValidatorFunc(obj,value,fieldName)
        if (func1 !== undefined) {
          return func1
        } else if (func2 !== undefined) {
          return func2
        } else if (func3 !== undefined) {
          return func3
        } else if(func4 !== undefined){
          return func4
        }else if(func5 !== undefined){
          return func5
        }else {
          return
        }
      }

      let getFunctionPincode = function (obj, value, fieldName) {
        var func1 = allowedValueValidatorFunc(obj, value, fieldName)
        var func2 = regExValidatorFunc(obj, value, fieldName)
        var func3 = getFunctionPincode(obj, value, fieldName)
        var func4 = defaultValidatorFunc(obj, value, fieldName)
        var func5 = optionalValidatorFunc(obj,value,fieldName)
        if (func1 !== undefined) {
          return func1
        } else if (func2 !== undefined) {
          return func2
        } else if (func3 !== undefined) {
          return func3
        } else if(func4 !== undefined){
          return func4
        }else if(func5 !== undefined){
          return func5
        }else {
          return
        }
      }

      let getFunctionText = function (obj, value, fieldName) {
        var func1 = allowedValueValidatorFunc(obj, value, fieldName)
        var func2 = regExValidatorFunc(obj, value, fieldName)
        var func3 = defaultValidatorFunc(obj, value, fieldName)
        var func4 = maxLengthValidatorFunc(obj, value, fieldName)
        var func5 = optionalValidatorFunc(obj,value,fieldName)
        if (func1 !== undefined) {
          return func1
        } else if (func2 !== undefined) {
          return func2
        } else if (func3 !== undefined){
            return func3
        } else if(func4 !== undefined){
           return func4
        }else if(func5 !== undefined){
           return func5
        }else {
          return
        }
      }

      let allowedValueValidatorFunc = function (obj, value, fieldName) {
        var i
        _.forEach(Object.keys(self.mObj[self.activeTab].schema.structure), function (value, key) {
          if (fieldName === value) {
            i = key
          }
        })
        if (self.mObj[self.activeTab].mapping[i].schemaObj.allowedValues.length > 0) {
          if (value !== undefined) {
            let check = _.includes(self.mObj[self.activeTab].mapping[i].schemaObj.allowedValues, value)
            if(check != true)
            return  'System allowedvalues are ' + self.mObj[self.activeTab].mapping[i].schemaObj.allowedValues
            else {
              return
            }
          }
        }
      }

      let defaultValidatorFunc = function (obj, value, fieldName) {

        var i
        _.forEach(Object.keys(self.mObj[self.activeTab].schema.structure), function (value, key) {
          if (fieldName === value) {
            i = key
          }
        })
        if (self.mObj[self.activeTab].mapping[i].schemaObj.defaultValue !== '' && self.mObj[self.activeTab].mapping[i].schemaObj.defaultValue !== undefined ) {

          if (value == "")
            return  'default value should be ' + self.mObj[self.activeTab].mapping[i].schemaObj.defaultValue
            else
              return
          }
        }

        let maxLengthValidatorFunc = function (obj, value, fieldName) {

          var i
          _.forEach(Object.keys(self.mObj[self.activeTab].schema.structure), function (value, key) {
            if (fieldName === value) {
              i = key
            }
          })
          if (self.mObj[self.activeTab].mapping[i].schemaObj.maxLength !== '') {
            if (value !== undefined && typeof(value) == "string") {
              let check = value.length
              if(check != self.mObj[self.activeTab].mapping[i].schemaObj.maxLength)
              return  'maxLength value should be' + self.mObj[self.activeTab].mapping[i].schemaObj.maxLength
              else {
                return
              }
            }
          }
          }

      let regExValidatorFunc = function (obj, value, fieldName) {
        var i
        _.forEach(Object.keys(self.mObj[self.activeTab].schema.structure), function (value, key) {
          if (fieldName === value) {
            i = key
          }
        })
        if (self.mObj[self.activeTab].mapping[i].schemaObj.regEx !== '') {
          if (value !== undefined) {
            let pttrn = new RegExp(self.mObj[self.activeTab].mapping[i].schemaObj.regEx)
            if (pttrn.test(value) === false && fieldName == 'max_imprint_color_allowed'){
              return 'Decimal value not allowed'
            }
            else if(pttrn.test(value) === false && fieldName != 'max_imprint_color_allowed'){
              return  'Value does not match with the regex'
            }
          }
        }
      }


        let schema_Obj = {}
        _.forEach(self.mObj[tab].mapping, function (value, key) {
          if(value.schemaObj.optional == true){
              if(value.schemaObj.type == 'date'){
                schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: dateValidatorFunc,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
              }
              else if(value.schemaObj.type == 'url'){
                schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: urlValidatorFunc,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
              }
              else if (value.schemaObj.type == 'email') {
                schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: emailValidatorFunc,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
              }
              else if (value.schemaObj.type == 'phone') {
                schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: phoneValidatorFunc,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
              }
              else if (value.schemaObj.type == 'pin-code') {
                schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: pincodeValidatorFunc,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
              }
              else{
                schema_Obj[value.sysHeader] = {type: value.schemaObj.type,validator:regExValidatorFunc,label: value.schemaObj.type,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
              }
          }
          else if(value.schemaObj.optional == false) {
            if(value.schemaObj.type == 'date'){
              schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: getFunctionDate,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
            }
            else if(value.schemaObj.type == 'url'){
              schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: getFunctionUrl,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
            }
            else if (value.schemaObj.type == 'email') {
              schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: getFunctionEmail,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
            }
            else if (value.schemaObj.type == 'phone') {
              schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: getFunctionPhone,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
            }
            else if (value.schemaObj.type == 'pin-code') {
              schema_Obj[value.sysHeader] = {type: "string",label: value.schemaObj.type,validator: getFunctionPincode,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
            }
            else{
              schema_Obj[value.sysHeader] = {type: value.schemaObj.type,label: value.schemaObj.type,validator: getFunctionText,optional:value.schemaObj.optional,allowedValues:value.schemaObj.allowedValues,defaultValue:value.schemaObj.defaultValues,maxLength: value.schemaObj.maxLength}
            }
          }
        })
        self.mObj[tab].schema = new Schema(schema_Obj)

         err_length = 0
         self.mObj[tab].data1 = []
         self.mObj[tab].headers1 = []
        self.mObj[tab].errmsg = []
        self.generateError(self.mObj[tab].newUploadCSV,self.mObj[tab].schema,schema_Obj,tab,errcols)
        // _.forEach(self.mObj[tab].newUploadCSV, function (value, key) {
        //     if(err_length > 0) {
        //       return false
        //     }
        //   self.mObj[tab].schema.validate(value, function (err, newP, errors) {
        //
        //     if (err) {
        //       throw err
        //     } else {
        //       if (errors.length) {
        //         err_length = errors.length
        //         let err_type = ''
        //         if (!_.isEqual(Object.values(value), [""])) {
        //
        //           self.mObj[tab].data1.push(Object.values(value))
        //           self.mObj[tab].headers1.push(Object.keys(value))
        //           let oldHeaders = _.keys(self.mObj[tab].newUploadCSV)
        //           _.forEach(errors, (item) => {
        //             errcols.push({
        //               cols: _.indexOf(self.mObj[tab].headers1[0], item.field),
        //               rows: key
        //             })
        //
        //             for(let key in schema_Obj){
        //               if(key == item.field){
        //                 err_type = schema_Obj[key].type
        //               }
        //             }
        //
        //             if(item.message == "Error during casting"){
        //               if(err_type == 'number'){
        //                 self.mObj[tab].errmsg.push('* Enter numeric value' + ' at column : ' + item.field)
        //               }
        //               else if(err_type == 'string'){
        //                 self.mObj[tab].errmsg.push('* Invalid value' + ' at column : ' + item.field)
        //               }
        //             }
        //             else {
        //               self.mObj[tab].errmsg.push('* ' + item.message + ' at column : ' + item.field)
        //             }
        //           })
        //
        //           self.mObj[tab].headerDisplay = false
        //           self.mObj[tab].newSchemaDisplay = false
        //           self.mObj[tab].previewDisplay = false
        //           self.mObj[tab].uploadDisplay = false
        //           self.mObj[tab].showHandson = true
        //           self.mObj[tab].errDisplay = true
        //           if(self.mObj[tab].load == true){
        //             self.mObj[tab].load = false
        //           }
        //           console.log("err_length")
        //           self.showerrmsg(errcols,tab)
        //           // return
        //         }
        //       } else {
        //           // return
        //       }
        //     }
        //   })
        // })

      if(err_length == 0){
        self.mObj[tab].headerDisplay = false
        self.mObj[tab].newSchemaDisplay = false
        self.mObj[tab].previewDisplay = false
        self.mObj[tab].uploadDisplay = false
        self.mObj[tab].showHandson = false
        $(".f-layout-copy").css("position","fixed");
        globalValidateResolve("done")
      } else {
        if(globalValidateResolveFlag === true) {
          resolve('done')
        }
      }
    }
  })
    },
     generateError(CSVdata,schema,schema_Obj,tab,errcols){
      return new Promise(async (resolve,reject)=> {
        let self = this
      _.forEach(CSVdata, function (value, key) {
          if(err_length > 0) {
            return false
          }
        schema.validate(value, function (err, newP, errors) {

          if (err) {
            throw err
          } else {
            if (errors.length) {
              err_length = errors.length
              let err_type = ''
              if (!_.isEqual(Object.values(value), [""])) {

                self.mObj[tab].data1.push(Object.values(value))
                self.mObj[tab].headers1.push(Object.keys(value))
                let oldHeaders = _.keys(CSVdata)
                _.forEach(errors, (item) => {
                  errcols.push({
                    cols: _.indexOf(self.mObj[tab].headers1[0], item.field),
                    rows: key
                  })

                  for(let key in schema_Obj){
                    if(key == item.field){
                      err_type = schema_Obj[key].type
                    }
                  }

                  if(item.message == "Error during casting"){
                    if(err_type == 'number'){
                      self.mObj[tab].errmsg.push('* Enter numeric value' + ' at column : ' + item.field)
                    }
                    else if(err_type == 'string'){
                      self.mObj[tab].errmsg.push('* Invalid value' + ' at column : ' + item.field)
                    }
                  }
                  else {
                    self.mObj[tab].errmsg.push('* ' + item.message + ' at column : ' + item.field)
                  }
                })

                self.mObj[tab].headerDisplay = false
                self.mObj[tab].newSchemaDisplay = false
                self.mObj[tab].previewDisplay = false
                self.mObj[tab].uploadDisplay = false
                self.mObj[tab].showHandson = true
                self.mObj[tab].errDisplay = true
                if(self.mObj[tab].load == true){
                  self.mObj[tab].load = false
                }
                self.showerrmsg(errcols,tab)
                resolve(err_length)
                // return
              }
            } else {
                // return
            }
          }
        })
      })
    })
    },
    Abort(tab){
      let self = this
      self.proceedBtn = true
      continue_flag = false
      self.showContinue = false
      self.mObj[tab].load = false
      self.mObj[tab].uploadCSV = []
      self.mObj[tab].newUploadCSV = []
      self.mObj[tab].headerDisplay = false
      self.mObj[tab].newSchemaDisplay = false
      self.mObj[tab].previewDisplay = false
      self.mObj[tab].uploadDisplay = true
      totalRecords = 0      // self.loadProcessing = false
      // self.loadProceed = false
      $(".f-layout-copy").css("position","fixed");
    },
    abortUploadedRecords(tab){
      this.deleteRecModal = false
      let tab_name = tab.replace(/ /g,"")
      api.request('delete', '/pdm-uploader-data/' + this.$route.params.id + '?sheet_name=' + tab).then(res => {

        api.request('get','/uploader/'+ this.$route.params.id).then(res => {
          if(Object.keys(res.data).indexOf(tab_name) >= 0){
            let obj = res.data
            delete obj[tab_name]
            api.request('put','/uploader/' + this.$route.params.id,obj).then(result => {
              this.mObj[tab].uploadCSV = []
              this.mObj[tab].newUploadCSV = []
              this.mObj[tab].csv = []
              this.mObj[tab].filter_flag = false
              this.mObj[tab].main_arr = []
              this.mObj[tab].headers = []
              this.mObj[tab].savePreviewDisplay = false
              this.mObj[tab].complete_flag = false
              if(this.mObj[tab].headerDisplay == true){
                this.mObj[tab].headerDisplay = false
              }
              if(this.mObj[tab].previewDisplay == true){
                this.mObj[tab].previewDisplay = false
              }
              this.mObj[tab].uploadDisplay = true
              let tab1 = tab.replace(/ /g,"_")
              $("#t-" + tab1).append(' <style>' + '#t-' +  tab1 + '{font-size: 16px;list-style-type: none; position: relative; }' + '#t-' + tab1 + ':before{content: " ";display: none;border: solid 0.8em rgb(73,78,107); border-radius: .8em; top: 35%; margin-top: -0.5em;}' + '#t-' + tab1 + ':after {content: " ";display: none;width: 0.3em; height: 0.6em;border: solid white;border-width: 0 0.2em 0.2em 0; position: absolute;left: 1em;top: 40%;margin-top: -0.2em;-webkit-transform: rotate(45deg); -moz-transform: rotate(45deg);-o-transform: rotate(45deg);transform: rotate(45deg);}</style>')
              if(tab == "Product Information"){
                prod_info_upld = false
                this.validate = true
              }

            })
          }
        })
      })
      .catch(error => {
        console.log("error............",error)
      })
    },
    AbortValidation(tab){
        let self = this
        self.proceedBtn = true
        self.ProceedLoading = false
        self.mObj[tab].errmsg = []
        self.mObj[tab].uploadCSV = []
        self.mObj[tab].newUploadCSV = []
        self.mObj[tab].data1 = []
        self.mObj[tab].headers1 = []
        totalRecords = 0
        $('table.htCore').each(function () {
          this.remove()
        })

        if(document.getElementsByClassName('ht_master handsontable')[0]){
          document.getElementsByClassName('ht_master handsontable')[0].remove()
        }

        if(document.getElementById('example1')){
          // document.getElementById('example1').style.display = 'none'
          document.getElementById('example1').innerHTML = ""
        }
        self.mObj[tab].showHandson = false
        self.mObj[tab].errDisplay = false
        self.mObj[tab].uploadDisplay = true
      },
    abortImport(){
       let self = this
       self.showValidationTable = false
       self.validation_data = true
       self.validation_completed = false
       self.val_data = []
       self.$store.state.data = []
      //  self.mObj["Product Information"].newUploadCSV = []
      //  self.mObj["Product Price"].newUploadCSV = []
       api.request('get', '/uploader/' + id).then(response => {
         let obj = self.ModifyObj(response.data)
         api.request('put','/uploader/' + id,obj[0]).then(result =>{
            self.setPage(obj[1],obj[2],result.data)
         })

       })
    },
    abortImportConfirm(){
      let self = this
      self.calledFromAbort = true
      self.importBtn = true
       let patch_obj = {
         "stepStatus": "validation_completed",
         "abort": true
       }
       api.request('patch', '/uploader/' + id,patch_obj).then(res => {
         self.import1 = false
         self.validating = false
         self.validation_completed = true
         self.uploadStep = false
         // self.importStep = false
         // self.validateStep = true
         self.currentStep = 1
       })
       .catch(error => {
       })
    },
    abortImportInProgress(){
      let self = this
      let patch_obj = {
        "stepStatus": "validation_completed",
        "abort_from_import" : true
      }
      api.request('patch', '/uploader/' + id,patch_obj).then(res => {
        self.import1 = false
        self.validating = false
        self.validation_completed = true
        self.uploadStep = false
        self.validateStep = true
        self.currentStep = 1
      })
      .catch(error => {
      })

    },
    ModifyObj(data){
      let keys = Object.keys(data)
      let filtered_keys = _.filter(keys, function(o) {
        if(o == 'ProductInformation' || o == 'ProductPrice' || o == 'ProductImprintData' || o == 'ProductShipping' || o == 'ProductImage' || o == 'ProductVariationPrice' || o == "ProductAdditionalCharges"){
          return o;
        }
      });

      for(let i=0; i<filtered_keys.length; i++){
        if(lodash.includes(keys, filtered_keys[i]) == true){
          let new_obj = data[filtered_keys[i]]
          new_obj["validateStatus"] = "pending"
          delete data[filtered_keys[i]]
          delete new_obj["currentRuleIndex"]
          delete new_obj["ruleIndex"]
          data[filtered_keys[i]] = new_obj
        }
      }
       data["stepStatus"] = "upload_pending"
       return [data,keys,filtered_keys]
    },
    AbortServerSideValidation(){
      let self = this
      self.showValidationTable = false
      $(".f-layout-copy").css("position","fixed");
      self.val_data = []
      let obj1 = self.ModifyObj(uploader_obj)
      api.request('put','/uploader/' + id,obj1[0]).then(result =>{
         self.setPage(obj1[1],obj1[2],result.data)
      })
    },
    async showerrmsg (errcols,tab,schema) {
     var example1 = document.getElementById('example1')
     let row1
     let col1
     let prop = {}
     var ht = await(new Handsontable(example1, { // eslint-disable-line
       data: [this.mObj[tab].data1[0]],
       colHeaders:this.mObj[tab].headers1[0],
       rowHeaders: true,
       height: '100%',
       stretchH: "all",
       cells: (row, col) => {
         var cellProp = {}
         _.forEach([errcols[0]], (value, key) => {
           if (col === value.cols && row === key) {
             row1 = key
             col1 = value.cols
             // cellProp.className = 'error'
             prop = cellProp
           }
         })
         return cellProp
       }
     }))

      setTimeout(function(){
        ht.selectCell(row1,col1,row1,col1,true)
      },200)
     if(document.getElementById('example1')){
       document.getElementById('example1').style.display = 'block'
     }
     $(".f-layout-copy").css("position","fixed");

     // document.getElementById('hot-display-license-info').style.display = 'none'
   },
   async modifyData (tab) {
       let schema = this.mObj[tab].schema
       let colHeaders = this.mObj[tab].headers1[0]
       let hotSettingsData = this.mObj[tab].data1
       let errMsgArray = this.mObj[tab].errmsg
       let userUploadedDataArr = this.mObj[tab].newUploadCSV
       let newHotSettingsData = []

       errMsgArray = []
       var errcols = []
       var self = this
       _.forEach(hotSettingsData, (value, key) => {
         let valueToBeValidated = _.object(colHeaders, value)
         schema.validate(valueToBeValidated, (err, newP, errors) => {
           if (err) {} else {
             // if (errors.length) {
             //     // errors_length = errors.length
             //   newHotSettingsData.push(Object.values(value))
             //   console.log("new...........",newHotSettingsData)
             //   self.mObj[tab].data1 = newHotSettingsData
             //   _.forEach(errors, (item) => {
             //     errcols.push({
             //       cols: _.indexOf(colHeaders, item.field),
             //       rows: key
             //     })
             //     errMsgArray.push('* ' + item.message + ' at column: ' + item.field)
             //   })
             //   self.mObj[tab].errmsg = errMsgArray
             // }
             // else {

               let modified_field = self.mObj[tab].errmsg[0].substring(self.mObj[tab].errmsg[0].indexOf(":") + 1);
               modified_field = modified_field.trim()

               let modifiedField_data = newP[modified_field]
               let modified_id = newP._id

               let new_arr = []
               lodash.transform(userUploadedDataArr, function(result, n) {
                   if (n._id == modified_id) {
                       n[modified_field] =  modifiedField_data
                   }
                   new_arr.push(n)
                   })

               userUploadedDataArr = []
               userUploadedDataArr = new_arr

             // }
           }
         })
       })

       if (userUploadedDataArr !== undefined) {
         self.mObj[tab].newUploadCSV =  userUploadedDataArr
         if(errcols.length > 0){
           $('table.htCore').each(function () {
             this.remove()
           })
           if(document.getElementsByClassName('ht_master handsontable')[0]){
             document.getElementsByClassName('ht_master handsontable')[0].remove()
           }
           self.showerrmsg(errcols,tab)
         }
         else{
           self.mObj[tab].errmsg = []
           self.mObj[tab].showHandson = false
           self.mObj[tab].errDisplay = false
           self.mObj[tab].load = true
           load_flag = false
           $('table.htCore').each(function () {
             this.remove()
           })
           if(document.getElementsByClassName('ht_master handsontable')[0]){
             document.getElementsByClassName('ht_master handsontable')[0].remove()
           }
           await self.ProceedToValidate(tab)
         }

       }

       if(document.getElementById('hot-display-license-info')){
         document.getElementById('hot-display-license-info').style.display = 'none'
       }
     },
    saveData(tab){
      let self = this
      self.mObj[tab].load = true
      load_flag = true
      var newCSV = _.map(self.mObj[tab].newUploadCSV, function(element) {
        return _.extend({}, element, {username: self.$store.state.user.email,"import-tracker_id":id,"fileID":CSVFile_id});
      });

      let obj= {
        "activetab" : tab,
        "newCSV": newCSV
      }
      socket.emit('pdmData', obj, (err, data) => {
        if (err) {
          self.$Notice.error({title: 'Error!', desc: 'Error in saving the data!'})
        }
      })
    self.proceedBtn = true
    if(self.mObj[tab].new_flag == 1){
      self.mObj[tab].new_flag = 0
    }
  },
  setprogress(message){
    let self = this
    self.val_data = []
    self.val_data = self.$store.state.data
    let progress_obj = _.filter(self.val_data, {'name':prop_keys[0]});
    progress_obj[0].progress = Math.round(message[prop_keys[0]].currentRuleIndex / message[prop_keys[0]].ruleIndex * 100);

  },

  setPage(keys,filtered_keys,response){
    let self = this
    self.uploadStep = true
    self.currentStep = 0


    for(let i=0;i<filtered_keys.length;i++){
      let uploaded_tabs = self.convert(filtered_keys[i]).replace(/ /g,"_");
      setTimeout(function(){
        $("#t-" + uploaded_tabs).css("background-color","#ccc","border-color","#ccc");
          $("#t-" + uploaded_tabs).append(' <style>' + '#t-' +  uploaded_tabs + '{font-size: 16px;list-style-type: none; position: relative; }' + '#t-' + uploaded_tabs + ':before{content: " ";display: block;border: solid 0.8em rgb(73,78,107); border-radius: .8em; top: 35%; margin-top: -0.5em;}' + '#t-' + uploaded_tabs + ':after {content: " ";display: block;width: 0.3em; height: 0.6em;border: solid white;border-width: 0 0.2em 0.2em 0; position: absolute;left: 1em;top: 40%;margin-top: -0.2em;-webkit-transform: rotate(45deg); -moz-transform: rotate(45deg);-o-transform: rotate(45deg);transform: rotate(45deg);}</style>')
      },0)
    }

    let diff_keys = _.difference(self.fileNames, filtered_keys);
    self.activeTab = self.convert(diff_keys[0])

      if(Object.keys(response).indexOf("ProductInformation") >= 0){
        self.mObj['Product Information'].tab_flag = true
        // self.arrangeTab("ProductInformation",response.id)
        prod_info_upld = true
        self.validate = false
      }
      else{
        self.mObj["Product Information"].uploadDisplay = true
      }
      if(Object.keys(response).indexOf("ProductPrice") >= 0){
          self.mObj['Product Price'].tab_flag = true
        // self.arrangeTab("ProductPrice",response.id)
      }
      else{
        self.mObj["Product Price"].uploadDisplay = true
      }
      if(Object.keys(response).indexOf("ProductImprintData") >= 0){
        self.mObj['Product Imprint Data'].tab_flag = true
        // self.arrangeTab("ProductImprintData",response.id)
      }
      else{
        self.mObj["Product Imprint Data"].uploadDisplay = true
      }
      if(Object.keys(response).indexOf("ProductShipping") >= 0){
        self.mObj['Product Shipping'].tab_flag = true
        // self.arrangeTab("ProductShipping",response.id)
      }
      else{
        self.mObj["Product Shipping"].uploadDisplay = true
      }
      if(Object.keys(response).indexOf("ProductImage") >= 0){
        self.mObj['Product Image'].tab_flag = true
        // self.arrangeTab("ProductImage",response.id)
      }
      else{
        self.mObj["Product Image"].uploadDisplay = true
      }
      if(Object.keys(response).indexOf("ProductAdditionalCharges") >= 0){
        self.mObj['Product Additional Charges'].tab_flag = true
        // self.arrangeTab("ProductAdditionalCharges",response.id)
      }
      else{
        self.mObj["Product Additional Charges"].uploadDisplay = true
      }
      if(Object.keys(response).indexOf("ProductVariationPrice") >= 0){
        self.mObj['Product Variation Price'].tab_flag = true
        // self.arrangeTab("ProductVariationPrice",response.id)
      }
      else{
        self.mObj["Product Variation Price"].uploadDisplay = true
      }

  },
  async arrangeTab(tabname,id){

    let self = this
    let tab = tabname.replace(/([A-Z])/g, ' $1').trim()
    if(self.mObj[tab].savePreviewDisplay == true){
      self.mObj[tab].savePreviewDisplay = false
    }
    self.mObj[tab].uploadDisplay = false
    self.mObj[tab].load = true
    let table_name = "uploader" + tabname.charAt(0).toUpperCase() + tabname.substr(1).toLowerCase()

    let res = await(api.request('get', '/pdm-uploader-data/?import_tracker_id=' + id + '&tables=' + table_name))

    self.mObj[tab].newUploadCSV = res.data
      self.mObj[tab].newUploadCSV = _.map(self.mObj[tab].newUploadCSV, function(element) {
        return _.extend({}, element, {is_checked: false});
      });
      self.mObj[tab].main_arr = lodash.chunk(self.mObj[tab].newUploadCSV, 5);

      let loop = self.mObj[tab].newUploadCSV.length/5
      let dec_val = loop.toString().split('.')
      if(dec_val[1] > 0){
        loop = dec_val[0] + 1
      }
      for(let i=0;i<=loop;i++){
        self.mObj[tab].mPage.push({'mCheck':false})
      }
      if(self.mObj[tab].main_arr.length != 0){
        self.mObj[tab].headers = Object.keys(res.data[0])
        self.map = true
        self.mObj[tab].load =  false
        self.mObj[tab].savePreviewDisplay = true
      }
      return;

    //  api.request('get', '/pdm-uploader-data/?import_tracker_id=' + id + '&tables=' + table_name).then(res => {
    //    self.mObj[tab].newUploadCSV = res.data
    //    self.mObj[tab].newUploadCSV = _.map(self.mObj[tab].newUploadCSV, function(element) {
    //      return _.extend({}, element, {is_checked: false});
    //    });
    //    console.log("+++++++++++self.mObj[tab].newUploadCSV",self.mObj[tab].newUploadCSV)
    //    self.mObj[tab].main_arr = lodash.chunk(self.mObj[tab].newUploadCSV, 5);
    //    let loop = self.mObj[tab].newUploadCSV.length/5
    //    for(let i=0;i<=loop;i++){
    //      self.mObj[tab].mPage.push({'mCheck':false})
    //    }
    //
    //    self.mObj[tab].headers = Object.keys(res.data[0])
    //    self.map = true
    //    self.mObj[tab].load =  false
    //    self.mObj[tab].savePreviewDisplay = true
    //    return;
    // })
},
  setValData(data,filtered_keys){
      uploader_obj = data
      prop_keys = filtered_keys
      this.val_data = []
      this.$store.state.data = []
      let self = this
      let rem_arr = []

      for(let i=0 ;i<filtered_keys.length;i++){
      for(let key in data){
          if(filtered_keys[i] == key){
            if(data[filtered_keys[i]].validateStatus == 'pending' && data[filtered_keys[i]].currentRuleIndex){
              self.val_data.push({"name":filtered_keys[i],"data":uploader_obj[filtered_keys[i]],"progress":Math.round(uploader_obj[filtered_keys[i]].currentRuleIndex / uploader_obj[filtered_keys[i]].ruleIndex * 100)})
              // rem_arr.push(filtered_keys[i])
            }
            else if(data[filtered_keys[i]].validateStatus == 'pending' && !data[filtered_keys[i]].currentRuleIndex){
              self.val_data.push({"name":filtered_keys[i],"data":uploader_obj[filtered_keys[i]],"progress":0})
            }
            else if(data[filtered_keys[i]].validateStatus == 'completed'){
              self.val_data.push({"name":filtered_keys[i],"data":uploader_obj[filtered_keys[i]],"progress":100})
              rem_arr.push(filtered_keys[i])
              // prop_keys.splice(i,1)
            }
          }
        }
      }
      for(let i=0;i<rem_arr.length;i++){
        for(let j=0;j<prop_keys.length;j++){
          if(rem_arr[i] == prop_keys[j]){
            prop_keys.splice(j,1)
          }
        }
      }


      self.$store.state.data = self.val_data
      if(prop_keys[0] != undefined){
        self.sheetwiseValidation(prop_keys[0],uploader_obj)
      }
      else{
        self.validation_completed = true
      }
      return;
  }
  },
  feathers: {
    'uploader': {
      updated (message) {
          let self = this
          if(message.id == this.$route.params.id){
            if(prop_keys.length != 0){

              uploader_obj = message
              if(message[prop_keys[0]] && message[prop_keys[0]]["currentRuleIndex"]){

                self.setprogress(message)
                if(message[prop_keys[0]]["validateStatus"] == 'completed'){
                  let changed_obj = _.filter(self.val_data, { 'name':prop_keys[0] });
                  changed_obj[0].progress = 100
                  changed_obj[0].data.validateStatus = "completed"


                  if(message.stepStatus == "validation_completed"){
                      self.validation_completed = true
                  }
                  if(self.$store.state.validationStatus == true){

                    prop_keys.splice(0,1)
                    if(prop_keys.length != 0){
                      self.sheetwiseValidation(prop_keys[0],uploader_obj)
                    }
                  }
                }
              }

            }
            else if(message.stepStatus == 'upload_pending'){
              let name = self.activeTab.replace(/\s/g, "")
              if(self.showValidationTable == true){
                self.showValidationTable = false
              }
              if(self.validation_data == false){
                self.validation_data = true
              }
              if(self.validation_completed == true){
                self.val_data = []
                self.$store.state.data = []
                self.validation_completed = false
                api.request('get', '/uploader/' + id).then(response => {
                  let obj = self.ModifyObj(response.data)
                  api.request('put','/uploader/' + id,obj[0]).then(result =>{
                     self.setPage(obj[1],obj[2],result.data)
                  })

                })
              }

              if(message[name] && message[name].uploadStatus == "completed"){
                self.mObj[self.activeTab].headerDisplay = false
                self.mObj[self.activeTab].previewDisplay = false
                self.mObj[self.activeTab].newSchemaDisplay = false
                self.mObj[self.activeTab].load = false
                self.mObj[self.activeTab].newUploadCSV = []
                self.mObj[self.activeTab].uploadCSV = []
                self.mObj[self.activeTab].csv_arr = []
                self.mObj[self.activeTab].mapping = []
                self.mObj[self.activeTab].tab_flag = true
                $(".f-layout-copy").css("position","fixed");
                // self.loadProcessing = false


                // self.mObj[self.activeTab].newUploadCSV = _.map(self.mObj[self.activeTab].newUploadCSV, function(element) {
                //   return _.extend({}, element, {is_checked: false});
                // });
                //
                // self.mObj[self.activeTab].main_arr = lodash.chunk(self.mObj[self.activeTab].newUploadCSV, 5);
                // let loop = self.mObj[self.activeTab].newUploadCSV.length/5
                // let dec_val = loop.toString().split('.')
                // if(dec_val[1] > 0){
                //   loop = dec_val[0] + 1
                // }
                // for(let i=0;i<=loop;i++){
                //   self.mObj[self.activeTab].mPage.push({'mCheck':false})
                // }
                //
                // self.mObj[self.activeTab].savePreviewDisplay = true

                if(self.activeTab == 'Product Information'){
                  prod_info_upld = true
                  self.validate = false
                }

                let new_tab = ''
                let old_tab_index = ''
                _.forEach(self.fileTypes, function(value,key){
                  if(value == self.activeTab){
                    new_tab = self.fileTypes[key + 1]
                    old_tab_index = value.replace(/ /g,"_");
                  }
                })
                $("#t-" + old_tab_index).css("background-color","#ccc","border-color","#ccc");
                $("#t-" + old_tab_index).append(' <style>' + '#t-' +  old_tab_index + '{font-size: 16px;list-style-type: none; position: relative; }' + '#t-' + old_tab_index + ':before{content: " ";display: block;border: solid 0.8em rgb(73,78,107); border-radius: .8em; top: 35%; margin-top: -0.5em;}' + '#t-' + old_tab_index + ':after {content: " ";display: block;width: 0.3em; height: 0.6em;border: solid white;border-width: 0 0.2em 0.2em 0; position: absolute;left: 1em;top: 40%;margin-top: -0.2em;-webkit-transform: rotate(45deg); -moz-transform: rotate(45deg);-o-transform: rotate(45deg);transform: rotate(45deg);}</style>')
                self.activeTab = new_tab

              }
            }
            else if(message.stepStatus == "validation_completed" ){
               if(self.validating == true){
                 self.validating = false
               }
               if(self.validation_completed == false){
                 self.validation_completed = true
               }
               if(self.uploadStep == true){
                 self.uploadStep = false
               }
               if(self.validateStep == false && self.importStep == true && self.calledFromAbort == true){
                 self.validateStep = true
                 self.currentStep = 1
                 self.calledFromAbort = false
               }

              self.validation_completed = true
            }
            else if(message.stepStatus == "import_in_progress" ){
               if(self.showValidationTable == true){
                 self.showValidationTable = false
               }
               if(self.validation_completed == true){
                 self.validation_completed = false
               }
               if(self.validation_data == false){
                 self.validation_data = true
               }
               if(self.validateStep == true){
                  self.validateStep = false
               }
               if(self.importStep == false){
                 self.importStep = true
                 self.currentStep = 2
               }
               if(self.abortImportBtn == true){
                 self.abortImportBtn = false
               }
                self.import1 = false
            }
            else if(message.stepStatus == "import_to_confirm" || message.stepStatus == "import_to_confirm_in_progress"){
              if(self.showValidationTable == true){
                self.showValidationTable = false
              }
              if(self.validation_completed == true){
                self.validation_completed = false
              }
              // if(self.validation_data == false){
              //   self.validation_data = true
              // }
              if(self.validateStep == true){
                self.validateStep = false
              }
              if(self.importStep == false){
                self.importStep = true
                self.currentStep = 2
              }
              self.import1 = true
              self.abortImportBtn = true
              self.importBtn = true


              if(message.stepStatus == "import_to_confirm_in_progress"){
                self.abortImportBtn = false
                self.import1 = true
                self.importBtn = false
              }
            }
            else if(message.stepStatus == "import_completed"){
              if(self.abortImportBtn == true){
                self.abortImportBtn = false
              }
              if(notice_flag == true){
                self.$Notice.success({title: 'Import Completed', desc: 'Your data has gone Live...'})
                notice_flag = false
              }
              self.$router.push('/uploader')
            }
          }

      }
    }
  },
    mounted(){
      let self = this
      id = self.$route.params.id
      self.loading = true
      self.$store.state.disableuser = true
      self.$store.state.disablesubscription = true
      notice_flag = true
      // self.loadProceed = false

      api.request('get', '/uploader/' + id ).then(response => {
        if(response.data != null){
                let keys = Object.keys(response.data)
                 let filtered_keys = []
                // let filtered_keys = _.filter(keys, function(o) {
                //   if(o == 'ProductInformation' || o == 'ProductPrice' || o == 'ProductImprintData' || o == 'ProductShipping' || o == 'ProductImage' || o == 'ProductVariationPrice' || o == "ProductAdditionalCharges"){
                //     return o;
                //   }
                // });

                let tab_array = ["ProductInformation","ProductPrice","ProductImprintData","ProductImage","ProductShipping","ProductAdditionalCharges","ProductVariationPrice"]
                for(let i=0;i<tab_array.length;i++){
                  for(let j=0;j<keys.length;j++){
                    if(tab_array[i] == keys[j]){
                      filtered_keys.push(tab_array[i])
                    }
                  }
                }


                  if(response.data.stepStatus == 'upload_pending'){
                    self.uploadStep = true
                    self.setPage(keys,filtered_keys,response.data)
                  }
                  else if(response.data.stepStatus == 'validation_running'){
                    this.uploadStep = false
                    this.validateStep = true
                    this.currentStep = 1
                    this.validating = false
                    this.showValidationTable = true

                    uploader_obj = response.data
                    prop_keys = filtered_keys
                    this.val_data = []
                    this.$store.state.data = []
                    let self = this
                    let rem_arr = []

                    if(self.$store.state.calledFromContinue == false){
                      for(let i=0 ;i<filtered_keys.length;i++){
                      for(let key in response.data){
                        if(filtered_keys[i] == key){
                          if(response.data[filtered_keys[i]].validateStatus == 'pending' && response.data[filtered_keys[i]].currentRuleIndex){
                            self.val_data.push({"name":filtered_keys[i],"data":uploader_obj[filtered_keys[i]],"progress":Math.round(uploader_obj[filtered_keys[i]].currentRuleIndex / uploader_obj[filtered_keys[i]].ruleIndex * 100)})
                          }
                          else if(response.data[filtered_keys[i]].validateStatus == 'pending' && !response.data[filtered_keys[i]].currentRuleIndex){
                            self.val_data.push({"name":filtered_keys[i],"data":uploader_obj[filtered_keys[i]],"progress":0})
                          }
                          else if(response.data[filtered_keys[i]].validateStatus == 'completed'){
                            self.val_data.push({"name":filtered_keys[i],"data":uploader_obj[filtered_keys[i]],"progress":100})
                            rem_arr.push(filtered_keys[i])
                            // prop_keys.splice(i,1)
                          }
                        }
                      }
                    }
                    self.$store.state.data = self.val_data
                  }

                  for(let i=0;i<rem_arr.length;i++){
                    for(let j=0;j<prop_keys.length;j++){
                      if(rem_arr[i] == prop_keys[j]){
                        prop_keys.splice(j,1)
                      }
                    }
                  }



                    if(response.data.validate_flag == 'running' || response.data.validate_flag == 'completed'){

                      if(self.val_data.length == 0){
                        self.$store.state.calledFromContinue = false
                        self.setValData(response.data,filtered_keys)
                      }
                      else if(self.val_data.length > 0){
                        self.$store.state.validationStatus = true
                        // self.setValData(response.data,filtered_keys)
                      }

                    }
                    else if(!response.data.validate_flag){
                      self.setValData(response.data,filtered_keys)
                    }

                  }
                  else if(response.data.stepStatus == 'validation_completed'){
                    this.validating = false
                    this.uploadStep = false
                    this.validateStep = true
                    this.currentStep = 1
                    // this.showValidationTable = false
                    this.validation_completed = true
                  }
                  else if(response.data.stepStatus == 'import_in_progress'){
                    this.uploadStep = false
                    this.validateStep = false
                    this.importStep = true
                    this.currentStep = 2
                    if(this.abortImportBtn == true){
                      this.abortImportBtn = false
                    }
                  }
                  else if(response.data.stepStatus == 'import_to_confirm' || response.data.stepStatus == 'import_to_confirm_in_progress'){

                    this.uploadStep = false
                    this.validateStep = false
                    this.importStep = true
                    this.currentStep = 2
                    this.import1 = true
                    this.abortImportBtn = true
                    if(response.data.stepStatus == 'import_to_confirm_in_progress'){

                      this.abortImportBtn = false
                      this.importBtn = false
                    }
                  }
                  else if(response.data.stepStatus == "import_completed"){
                    this.$router.push('/uploader')
                  }
        }
      })

      socket.emit('uploader-schema::find', {"subscriptionId":this.$store.state.subscription_id,"import_tracker_id":id}, (e, res) => {
        if(res){
          self.existingSchemaData = res.data[0]
          let schemaNames = lodash.groupBy(res.data,"tabname");
          let schemavalue = lodash.isEmpty(schemaNames)

          if(schemavalue != true){
            _.forEach(schemaNames,(value,key) => {
              for(let i=0;i<value.length;i++){
                if(key != undefined){
                  self.mObj[key].schemaList.push({"value":value[i].name,"label":value[i].name})
                }
              }
            })
            for(let i=0;i<self.fileTypes.length;i++){

              self.mObj[self.fileTypes[i]].schemaList = lodash.orderBy(self.mObj[self.fileTypes[i]].schemaList, 'value', 'asc');
              let new_index = lodash.findIndex(self.mObj[self.fileTypes[i]].schemaList, function(o) { return o.value == '--Add new--'; });
              self.mObj[self.fileTypes[i]].schemaList.splice(self.mObj[self.fileTypes[i]].schemaList.length-1,0,self.mObj[self.fileTypes[i]].schemaList.splice(new_index,1)[0]);
            }

            for(let i=0;i<self.fileTypes.length;i++){
              if(self.mObj[self.fileTypes[i]].schemaList[0].value == '--Add new--'){
                self.mObj[self.fileTypes[i]].display = true
              }
            }
          }


          if(schemavalue == true){
            for(let i=0;i<self.fileTypes.length;i++){
              self.mObj[self.fileTypes[i]].selected_schema = "--Add new--"
              self.mObj[self.fileTypes[i]].display = true
            }
            self.loading = false
            for(let i=0;i<self.fileTypes.length;i++){
              self.mObj[self.fileTypes[i]].uploadDisplay = true
            }
          }
          else{
            for(let i=0;i<self.fileTypes.length;i++){
              self.mObj[self.fileTypes[i]].selected_schema = self.mObj[self.fileTypes[i]].schemaList[0].value
            }
            self.loading = false
          }

        }
        else {
          this.$Notice.error({
           title: e.response.data.message
         });
        }

      })
    }
}
</script>
<style>
.vue-tabs .nav-stacked > li:before {
    position: absolute;
    background-color: #494E6B;
    margin: 6px;
}
.close {
  padding: 0px 9px !important;
  float: right;
  border: 0 !important;
}
.savePreview {
  border: 1px solid #bbbec4 !important;
}
.uploadSteps{
  padding-left: 20% !important;
}
.ivu-steps-item.ivu-steps-status-process .ivu-steps-content {
    color: #337ab7;
    position: absolute;
    text-align: center;
    font-size: 14px;
    font-weight: bold;
}
.ivu-steps-item.ivu-steps-status-process .ivu-steps-content:hover{
  color: #494e6b;
}
.ivu-steps-item.ivu-steps-status-wait .ivu-steps-content {
    color: #777;
    font-size: 14px;
    font-weight: bold;
}
.ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner {
    border-color: #494e6b;
    background-color: #494e6b;
    width: 40px;
    height: 40px;
}
.ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner span, .ivu-steps-item.ivu-steps-status-process .ivu-steps-head-inner>.ivu-steps-icon {
    color: #fff;
    vertical-align: -webkit-baseline-middle;
}
.ivu-steps-item.ivu-steps-status-wait .ivu-steps-head-inner span, .ivu-steps-item.ivu-steps-status-wait .ivu-steps-head-inner>.ivu-steps-icon {
    color: #777;
    vertical-align: -webkit-baseline-middle;
}
.ivu-steps-item.ivu-steps-status-wait .ivu-steps-head-inner {
    background-color: #fff;
    width: 40px;
    height: 40px;
    border-color: #777;
}
.ivu-steps {
  font-size: 0;
  width: inherit !important;
  line-height: 1.5;
}
.vue-tabs .nav-stacked > li{
    border: 1px solid #ddd !important;
    border-radius: 5px;
    padding-left: 0px !important;
    color: #494e6b;
    width: 140% !important;
    margin-top: 30%;
    margin-bottom: -2px;
}
.vue-tabs .nav > li span.title {
    display: flex;
    justify-content: center;
    font-size: 15px;
}
.ivu-form-item {
    margin-bottom: 15px;
    vertical-align: top;
    zoom: 1;
    /*margin-left:-4%;*/
}
.ivu-form .ivu-form-item-label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 15px;
    color: #495060;
    line-height: 1;
    padding: 10px 12px 10px 0;
    box-sizing: border-box;
}
/*.ivu-input {
    display: inline-block;
    margin-left: 68px;
    width: 60%;
    height: 32px;
    line-height: 1.5;
    padding: 4px 7px;
    font-size: 12px;
    border: 1px solid #dddee1;
    border-radius: 4px;
    color: #495060;
    background-color: #fff;
    background-image: none;
    position: relative;
    cursor: text;
    transition: border .2s ease-in-out,background .2s ease-in-out,box-shadow .2s ease-in-out;
    margin-top: 4%;
}*/

/*.ivu-btn-ghost {
    color: #495060;
    background-color: transparent;
    border-color: #fff;
    padding-left: 0px;
    padding-right: 0px;
}
.ivu-btn-ghost:hover {
    color: #495060;
    background-color: transparent;
    border-color: #fff;
    padding-left: 0px;
    padding-right: 0px;
}
*/
.btnghost {
  color: #495060 !important;
  background-color: transparent !important;
  border-color: #fff !important;
  /*padding-left: 0px !important;*/
  /*padding-right: 0px !important;   */
}
.btnghost:hover {
    color: #495060 !important;
    background-color: transparent !important;
    border-color: #fff !important;
    /*padding-left: 0px !important;*/
    /*padding-right: 0px !important;*/
}
.ivu-upload-drag {
  background: #fff;
  border: 2px dashed #494e6b;
  border-radius: 0px;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color .2s ease;
  /*margin-left: -3%;*/
}
.ivu-upload-drag:hover {
  background: #fff;
  border: 2px dashed #494e6b;
  border-radius: 0px;
  text-align: center;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: border-color .2s ease;
}

#msg{
  position: absolute;
  font-weight: 500;
  font-size: 25px;
  top: 35%;
  text-align: center;
  width: 100%;
  color: #98878f;
  display: block;
}

#small{
  font-size: 60%;
  color: #bbb;;
  position:relative;
  margin-top: 6%;
  text-align:center;
  font-size: 15px;
  /*margin-left: -3%;*/
}
.ivu-upload-list-file {
    padding: 4px;
    color: #495060;
    border-radius: 4px;
    transition: background-color .2s ease-in-out;
    overflow: hidden;
    position: relative;
    display:none;
}
/*.ivu-btn-success {
    margin-top: 60%;
    color: #fff;
    background-color: #1fb58f;
    border-color: #1fb58f;
    width: 152%;
}
.ivu-btn-success:disabled {
    margin-top: 60%;
    color: #fff;
    background-color: #1fb58f;
    border-color: #1fb58f;
    width: 152%;
}*/

.ivu-table-cell {
  padding-left: 18px;
  padding-right: 18px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: normal;
  word-break: break-all;
  box-sizing: border-box;
  color: #495060 !important;
  font-size: 13px !important;
  text-align: left !important;
}
.headercolor {
  color: #fff !important;
}
.sucessbtn {
  margin-top: 60%;
  color: #fff !important;
  background-color: #1fb58f !important;
  border-color: #1fb58f !important;
  width: 152%;
}
.sucessbtn:disabled {
  margin-top: 60%;
  color: #fff !important;
  background-color: #1fb58f !important;
  border-color: #1fb58f !important;
  width: 152%;
}
#upload-csv-zone>.file-zone {
  border: 2px dashed #494e6b;
  position: relative;
  margin-bottom: 15px;
}

#upload-csv-zone>.file-zone>input[type="file"] {
  width: 100%;
  height: 200px;
  opacity: 0;
}

#upload-csv-zone .dz-spinner {
  display: none;
}

#upload-csv-zone.onprogress .dz-spinner {
  position: absolute;
  font-weight: 500;
  font-size: 25px;
  top: 23%;
  text-align: center;
  width: 100%;
  color: #98878f;
  display: block;
}

#upload-csv-zone .dz-message {
  position: absolute;
  font-weight: 500;
  font-size: 25px;
  top: 35%;
  text-align: center;
  width: 100%;
  color: #98878f;
  display: block;
}

#upload-csv-zone .dz-message>small {
  font-size: 60%;
  color: #bbb;
}

#upload-csv-zone.onprogress .dz-message {
  display: none;
}

.ivu-table-wrapper {
    position: relative;
    border: 1px solid #dddee1 !important;
    border-bottom: 0;
    border-right: 0;
    /*margin-left: -3%;*/
}
.customtable th {
  height: 40px !important;
  white-space: nowrap;
  overflow: hidden;
  background-color: black !important;
  color: #fff !important;
  font-size: 13px !important;
  padding: 9px !important;
  text-align: center;
}
.customtable td {
  height: 48px !important;
  text-align: center !important;
  background-color: #fff !important;
  transition: background-color .2s ease-in-out;
  font-size: 13px !important;
  /*padding: 9px !important;*/
}
/*.handsontable thead {
    box-sizing: content-box;
    -webkit-box-sizing: content-box;
    background-color: #eee;
    color: #fff;
    font-size: 14px;
}*/
#example1 {
  width: 100%!important;
}
.handsontable td.error {

  border-left: 2px solid #2d8cf0;
  border-right: 2px solid #2d8cf0;
  border-top: 2px solid #2d8cf0;
  border-bottom: 2px solid #2d8cf0;
  outline: none;
}

.demo-spin-icon-load{
       animation: ani-demo-spin 1s linear infinite;
   }
 @keyframes ani-demo-spin {
     from { transform: rotate(0deg);}
     50%  { transform: rotate(180deg);}
     to   { transform: rotate(360deg);}
 }
 .demo-spin-col{
     height: 100px;
     position: relative;
     border: 1px solid #eee;
 }
 .preview{
   border: 1px solid #bbbec4 !important;
   padding: 25px !important;
 }
 .close {
    float: right;
    border: 0;
    margin-top: -4%;
    font-size: 22px;
    margin-right: 1%;
}
.redIcon {
  color: red;
  font-size: 25px;
  margin-top: 6px;
}
.delete {
  color: #fff;
  background-color: #ff4949 !important;
  border-color: #ff4949 !important;
  margin: 1% !important;
}
.recordsDisplay{
  border: 1px solid #eee !important;
  background-color: #f3f3f3 !important;
}
.hclass{
  margin-bottom: 1%;
  text-transform: capitalize;
  margin-top: 1%;
  margin-left: 1%;
}
.previewtable{
  padding: 25px;
}

.filter{
  margin-left: 5px;
  width: 20%;
  float: right;
  margin-top: 1%;
  margin-right: 1%;
}

.funnel{
  font-size: large;
}

#hot-display-license-info{
  display: none;
}

.handsontable{
  margin: 5px !important;
}

.ht_master{
  width: 100% !important;
}

.redClass{
  color:red;
  font-size:14px;
  padding-left:10px;
  border:0px;
}

.border:before{
  background-color: #fff !important;
}

#valid_err{
  border-bottom: solid 2px #ccc;
}

.ivu-card:hover {
    box-shadow: 0 0px;
    border-color: #fff;
}
.ivu-checkbox{
  margin-left: 28px;
  margin-right: 28px;
}

.pagination{
  margin-top: 10px;
}

.ivu-page {
  float: right;
}

#importBtn[disabled] {
  color: #fff;
  background-color: ##1fb58f;
  border-color: ##1fb58f;
}

.apply {
  margin-top: -5px !important;
  font-size: 24px !important;
  border: 0 !important;
}

.reset{
  margin-top: -5px !important;
  font-size: 24px !important;
  border: 0 !important;
  margin-left: -10px !important;
}

.buttons button {
  font-size: 2.5em;
  font-weight: bold;
  font-family: "Arial", serif;
  /*padding: 8px 40px;*/
  background: white;
  border: 0px;
  margin-right: 20px;
  margin-left: 20px;
  margin-top: 50px;
  -moz-border-radius: 50px;
  -webkit-border-radius: 50px;
  border-radius: 50px;
}

.buttons button:focus {
  outline: none
}
.buttons button:active {
  border: 0;
  color: #50627E;
  outline: none;
}

.buttons input:focus {
 /*background: #FFFFAD;*/
 outline: none;
}
/*.tick{*/
  /*content: url("../assets/images/green_tick.jpg");
  width:20px;
  height:10px;
  float:left;
}*/

.demo-upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 60px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .demo-upload-list img{
        width: 100%;
        height: 100%;
    }
    .demo-upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.6);
    }
    .demo-upload-list:hover .demo-upload-list-cover{
        display: block;
    }
    .demo-upload-list-cover i{
        color: #fff;
        font-size: 20px;
        cursor: pointer;
        margin: 0 2px;
    }
    .check{
      cursor: pointer;
      font-size: 12px;
      display: inline-block;
      margin-right: 8px;
      /*padding-left: 7px;*/
    }
    .allowedTags{
      width: 253px !important;
      height: 25px !important;
    }
    .propertychbx{
      float:right;
    }
    .prptycontent{
      overflow: inherit !important;
    }
    #prptychckbox span {
      margin-left: 0px;
      margin-right: 0px;
    }

#example1 .handsontable .wtHider {
    height: 100% !important;

}
#example1 .ht_master .wtHolder {
    height: 100% !important;
}

.tabList {
    display: block;
    width: 25% !important;
}
.tabView {
    display: block;
    width: 75% !important;
}


</style>
