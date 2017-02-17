// replace smart object’s content and save jpgs;
// 2017, use it at your own risk;
#target photoshop
if (app.documents.length > 0) {
var myDocument = app.activeDocument;
var theName= myDocument.name.match(/(.*)\.[^\.]+$/)[1];
var thePath = myDocument.path;
var theLayer = myDocument.activeLayer;
// psd options;
psdOpts = new PhotoshopSaveOptions();
psdOpts.embedColorProfile = true;
psdOpts.alphaChannels = true;
psdOpts.layers = true;
psdOpts.spotColors = true;



// jpg options;
var jpegOptions = new JPEGSaveOptions();
jpegOptions.quality = 9;
jpegOptions.embedColorProfile = true;
jpegOptions.matte = MatteType.NONE;
// check if layer is smart object;
if (theLayer.kind != "LayerKind.SMARTOBJECT") {alert ("selected layer is not a smart object")}
else {
// select files;
if ($.os.search(/windows/i) != -1) {var theFiles = File.openDialog ("Please select files", "*.png;*.jpg;*.jpeg;*.psd;*.tif", true)}
else {var theFiles = File.openDialog ("Please select files", getFiles, true)};
if (theFiles) {
// work through the array;
for (var m = 0; m < theFiles.length; m++) {
// replace smart object;
theLayer = replaceContents (theFiles[m], theLayer);
var theNewName = theFiles[m].name.match(/(.*)\.[^\.]+$/)[1];
createText("GTWalsheim-Bold", 44, 0,0,0, theNewName.slice(0, -3), 25, 50)

//save jpg;
myDocument.saveAs((new File(thePath+"/"+theNewName+".jpg")),jpegOptions,true);
}
}
}
};
////// get psds, tifs and jpgs from files //////
function getFiles (theFile) {
if (theFile.name.match(/\.(psd|tif|psb|jpg|png|jpeg)$/i) != null || theFile.constructor.name == "Folder") {
return true
};
};
////// replace contents //////
function replaceContents (newFile, theSO) {
app.activeDocument.activeLayer = theSO;
// =======================================================
var idplacedLayerReplaceContents = stringIDToTypeID( "placedLayerReplaceContents" );
var desc3 = new ActionDescriptor();
var idnull = charIDToTypeID( "null" );
desc3.putPath( idnull, new File( newFile ) );
var idPgNm = charIDToTypeID( "PgNm" );
desc3.putInteger( idPgNm, 1 );
executeAction( idplacedLayerReplaceContents, desc3, DialogModes.NO );
return app.activeDocument.activeLayer
};

function createText(fface, size, colR, colG, colB, content, tX, tY)
{
  var targetLayer = makeActiveByName('Text');
  if(undefined!=targetLayer) targetLayer.remove();// if layer was found - transform

  // Add a new layer in the new document
  var artLayerRef = app.activeDocument.artLayers.add()

  // Specify that the layer is a text layer
  artLayerRef.kind = LayerKind.TEXT

  artLayerRef.textItem.justification = Justification.LEFT

  artLayerRef.name = "Text";

  //This section defines the color of the hello world text
  textColor = new SolidColor();
  textColor.rgb.red = colR;
  textColor.rgb.green = colG;
  textColor.rgb.blue = colB;
  var newContent = decodeURI(content);
  //Get a reference to the text item so that we can add the text and format it a bit
  textItemRef = artLayerRef.textItem
  textItemRef.font = fface;
  textItemRef.contents = newContent;
  textItemRef.color = textColor;
  textItemRef.size = size
  textItemRef.position = new Array(tX, tY) //pixels from the left, pixels from the top
}

function makeActiveByName( lyrName ){
     try{
          var desc = new ActionDescriptor();
               var ref = new ActionReference();
               ref.putName( charIDToTypeID( "Lyr " ), lyrName );
          desc.putReference( charIDToTypeID( "null" ), ref );
          desc.putBoolean( charIDToTypeID( "MkVs" ), false );
          executeAction( charIDToTypeID( "slct" ), desc, DialogModes.NO );
          return activeDocument.activeLayer;
     }catch(e){}
};
