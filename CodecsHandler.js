var CodecsHandler=(function(){function preferCodec(sdp,codec,useRed=false,useUlpfec=false){if(codec){codec=codec.toLowerCase();}
var info=splitLines(sdp);if(!info.videoCodecNumbers){return sdp;}
var preferCodecNumber='';var preferErrorCorrectionNumbers=[];if(codec==='vp8'){preferCodecNumber=info.vp8LineNumber||'';}else if(codec==='vp9'){preferCodecNumber=info.vp9LineNumber||'';}else if(codec==='h264'){preferCodecNumber=info.h264LineNumber||'';}else if(codec==='h265'){preferCodecNumber=info.h265LineNumber||'';}else if(codec==='av1'){preferCodecNumber=info.av1LineNumber||'';}else if(codec==='red'){preferCodecNumber=info.redLineNumber||'';}else if(codec==='fec'){preferCodecNumber=info.ulpfecLineNumber||'';}
if(useRed&&info.redLineNumber){preferErrorCorrectionNumbers.push(info.redLineNumber);}
if(useUlpfec&&info.ulpfecLineNumber){preferErrorCorrectionNumbers.push(info.ulpfecLineNumber);}
if(preferCodecNumber===''){return sdp;}
var newOrder=[preferCodecNumber].concat(preferErrorCorrectionNumbers);info.videoCodecNumbers.forEach(function(codecNumber){if(!newOrder.includes(codecNumber)){newOrder.push(codecNumber);}});var newLine=info.videoCodecNumbersOriginal.split('SAVPF')[0]+'SAVPF '+newOrder.join(' ');sdp=sdp.replace(info.videoCodecNumbersOriginal,newLine);return sdp;}
function splitLines(sdp){var info={};sdp.split('\n').forEach(function(line){if(line.indexOf('m=video')===0){info.videoCodecNumbers=[];line.split('SAVPF')[1].split(' ').forEach(function(codecNumber){codecNumber=codecNumber.trim();if(!codecNumber||!codecNumber.length)return;info.videoCodecNumbers.push(codecNumber);info.videoCodecNumbersOriginal=line;});}
var LINE=line.toUpperCase();if(LINE.indexOf('VP8/90000')!==-1&&!info.vp8LineNumber){info.vp8LineNumber=line.replace('a=rtpmap:','').split(' ')[0];}
if(LINE.indexOf('VP9/90000')!==-1&&!info.vp9LineNumber){info.vp9LineNumber=line.replace('a=rtpmap:','').split(' ')[0];}
if(LINE.indexOf('H264/90000')!==-1&&!info.h264LineNumber){info.h264LineNumber=line.replace('a=rtpmap:','').split(' ')[0];}
if(LINE.indexOf('H265/90000')!==-1&&!info.h265LineNumber){info.h265LineNumber=line.replace('a=rtpmap:','').split(' ')[0];}
if(LINE.indexOf('AV1X/90000')!==-1&&!info.av1LineNumber){info.av1LineNumber=line.replace('a=rtpmap:','').split(' ')[0];}else if(LINE.indexOf('AV1/90000')!==-1&&!info.av1LineNumber){info.av1LineNumber=line.replace('a=rtpmap:','').split(' ')[0];}
if(LINE.indexOf('RED/90000')!==-1&&!info.redLineNumber){info.redLineNumber=line.replace('a=rtpmap:','').split(' ')[0];}
if(LINE.indexOf('ULPFEC/90000')!==-1&&!info.ulpfecLineNumber){info.ulpfecLineNumber=line.replace('a=rtpmap:','').split(' ')[0];}});return info;}
function preferAudioCodec(sdp,codec,useRed=false,useUlpfec=false){if(codec){codec=codec.toLowerCase();}
var info=splitAudioLines(sdp);if(!info.audioCodecNumbers){return sdp;}
var preferCodecNumber='';var errorCorrectionNumbers=[];if(codec&&info[codec+'LineNumber']){preferCodecNumber=info[codec+'LineNumber'];}
if(useRed&&info.redPcmLineNumber){errorCorrectionNumbers.push(info.redPcmLineNumber);}
if(useRed&&info.redLineNumber&&!info.redPcmLineNumber){errorCorrectionNumbers.push(info.redLineNumber);}
if(useUlpfec&&info.ulpfecLineNumber){errorCorrectionNumbers.push(info.ulpfecLineNumber);}
var newOrder=[preferCodecNumber].concat(errorCorrectionNumbers);info.audioCodecNumbers.forEach(function(codecNumber){if(!newOrder.includes(codecNumber)){newOrder.push(codecNumber);}});var newLine=info.audioCodecNumbersOriginal.split('SAVPF')[0]+'SAVPF '+newOrder.join(' ');sdp=sdp.replace(info.audioCodecNumbersOriginal,newLine);return sdp;}
function splitAudioLines(sdp){var info={};sdp.split('\n').forEach(function(line){if(line.indexOf('m=audio')===0){info.audioCodecNumbers=[];line.split('SAVPF')[1].split(' ').forEach(function(codecNumber){codecNumber=codecNumber.trim();if(!codecNumber||!codecNumber.length)return;info.audioCodecNumbers.push(codecNumber);info.audioCodecNumbersOriginal=line;});}
var LINE=line.toLowerCase();if(LINE.indexOf('opus/48000')!==-1&&!info.opusLineNumber){info.opusLineNumber=line.replace('a=rtpmap:','').split(' ')[0];}
if(LINE.indexOf('isac/32000')!==-1&&!info.isacLineNumber){info.isacLineNumber=line.replace('a=rtpmap:','').split(' ')[0];}
if(LINE.indexOf('g722/8000')!==-1&&!info.g722LineNumber){info.g722LineNumber=line.replace('a=rtpmap:','').split(' ')[0];}
if(LINE.indexOf('pcmu/8000')!==-1&&!info.pcmuLineNumber){info.pcmuLineNumber=line.replace('a=rtpmap:','').split(' ')[0];}
if(LINE.indexOf('pcma/8000')!==-1&&!info.pcmaLineNumber){info.pcmaLineNumber=line.replace('a=rtpmap:','').split(' ')[0];}
if(LINE.indexOf('red/48000')!==-1&&!info.redLineNumber){info.redLineNumber=line.replace('a=rtpmap:','').split(' ')[0];}
if(LINE.indexOf('ulpfec/48000')!==-1&&!info.ulpfecLineNumber){info.ulpfecLineNumber=line.replace('a=rtpmap:','').split(' ')[0];}
if(line.indexOf('red/8000')!==-1&&!info.redPcmLineNumber){info.redPcmLineNumber=line.replace('a=rtpmap:','').split(' ')[0];}
if(line.indexOf('ulpfec/8000')!==-1&&!info.ulpfecLineNumber){info.ulpfecLineNumber=line.replace('a=rtpmap:','').split(' ')[0];}});return info;}
function addRedForPcmToSdp(sdp,info,redPcmLine){if(!info.audioCodecNumbers.includes(redPcmLine)){var newOrder=info.audioCodecNumbers.filter(codecNumber=>codecNumber!==redPcmLine);newOrder.unshift(redPcmLine);var newLine=info.audioCodecNumbersOriginal.split('SAVPF')[0]+'SAVPF '+newOrder.join(' ');sdp=sdp.replace(info.audioCodecNumbersOriginal,newLine);}
return sdp;}
function extractSdp(sdpLine,pattern){var result=sdpLine.match(pattern);return(result&&result.length==2)?result[1]:null;}
function disableNACK(sdp){if(!sdp||typeof sdp!=='string'){throw 'Invalid arguments.';}
sdp=sdp.replace(/a=rtcp-fb:(\d+) nack\r\n/g,'');sdp=sdp.replace(/a=rtcp-fb:(\d+) nack pli\r\n/g,'a=rtcp-fb:$1 pli\r\n');sdp=sdp.replace(/a=rtcp-fb:(\d+) pli nack\r\n/g,'a=rtcp-fb:$1 pli\r\n');return sdp;}
function disableREMB(sdp){if(!sdp||typeof sdp!=='string'){throw 'Invalid arguments.';}
sdp=sdp.replace(/a=rtcp-fb:(\d+) goog-remb\r\n/g,'');return sdp;}
function disablePLI(sdp){if(!sdp||typeof sdp!=='string'){throw 'Invalid arguments.';}
sdp=sdp.replace(/a=rtcp-fb:(\d+) pli\r\n/g,'');sdp=sdp.replace(/a=rtcp-fb:(\d+) nack pli\r\n/g,'a=rtcp-fb:$1 nack\r\n');sdp=sdp.replace(/a=rtcp-fb:(\d+) pli nack\r\n/g,'a=rtcp-fb:$1 nack\r\n');return sdp;}
function findLine(sdpLines,prefix,substr){return findLineInRange(sdpLines,0,-1,prefix,substr);}
function findLineInRange(sdpLines,startLine,endLine,prefix,substr){var realEndLine=endLine!==-1?endLine:sdpLines.length;for(var i=startLine;i<realEndLine;++i){if(sdpLines[i].indexOf(prefix)===0){if(!substr||sdpLines[i].toLowerCase().indexOf(substr.toLowerCase())!==-1){return i;}}}
return null;}
function getCodecPayloadType(sdpLine){var pattern=new RegExp('a=rtpmap:(\\d+) \\w+\\/\\d+');var result=sdpLine.match(pattern);return(result&&result.length===2)?result[1]:null;}
function getVideoBitrates(sdp){var defaultBitrate=false;var sdpLines=sdp.split('\r\n');var mLineIndex=findLine(sdpLines,'m=','video');if(mLineIndex===null){return defaultBitrate;}
var videoMLine=sdpLines[mLineIndex];var pattern=new RegExp('m=video\\s\\d+\\s[A-Z/]+\\s');var sendPayloadType=videoMLine.split(pattern)[1].split(' ')[0];var fmtpLine=sdpLines[findLine(sdpLines,'a=rtpmap',sendPayloadType)];var codec=fmtpLine.split('a=rtpmap:'+sendPayloadType)[1].split('/')[0];var codecIndex=findLine(sdpLines,'a=rtpmap',codec+'/90000');var codecPayload;if(codecIndex){codecPayload=getCodecPayloadType(sdpLines[codecIndex]);}
if(!codecPayload){return defaultBitrate;}
var codecDetails=findLine(sdpLines,'a=fmtp:'+codecPayload);var rtxIndex=findLine(sdpLines,'a=rtpmap','rtx/90000');var rtxPayload;if(rtxIndex){rtxPayload=getCodecPayloadType(sdpLines[rtxIndex]);}
if(!rtxIndex){return defaultBitrate;}
var rtxFmtpLineIndex=findLine(sdpLines,'a=fmtp:'+codecPayload.toString());if(rtxFmtpLineIndex!==null){try{var maxBitrate=parseInt(sdpLines[rtxFmtpLineIndex].split("x-google-max-bitrate=")[1].split(";")[0]);var minBitrate=parseInt(sdpLines[rtxFmtpLineIndex].split("x-google-min-bitrate=")[1].split(";")[0]);}catch(e){rtxFmtpLineIndex=findLine(sdpLines,'a=fmtp:'+codecPayload.toString());if(rtxFmtpLineIndex!==null){try{var maxBitrate=parseInt(sdpLines[rtxFmtpLineIndex].split("x-google-max-bitrate=")[1].split(";")[0]);var minBitrate=parseInt(sdpLines[rtxFmtpLineIndex].split("x-google-min-bitrate=")[1].split(";")[0]);}catch(e){return defaultBitrate;}}else{return defaultBitrate;}}
if(minBitrate>maxBitrate){maxBitrate=minBitrate;}
if(maxBitrate<1){maxBitrate=1;}
return maxBitrate}else{return defaultBitrate;}}
function setVideoBitrates(sdp,params=false,codec=false){if(codec){codec=codec.toUpperCase();}else{codec="VP8";}
var sdpLines=sdp.split('\r\n');var mLineIndex=findLine(sdpLines,'m=','video');if(mLineIndex===null){return sdp;}
var videoMLine=sdpLines[mLineIndex];var pattern=new RegExp('m=video\\s\\d+\\s[A-Z/]+\\s');var sendPayloadType=videoMLine.split(pattern)[1].split(' ')[0];var fmtpLine=sdpLines[findLine(sdpLines,'a=rtpmap',sendPayloadType)];var codecName=fmtpLine.split('a=rtpmap:'+sendPayloadType)[1].split('/')[0];codec=codecName||codec;params=params||{};var min_bitrate="30";if(params.min){min_bitrate=params.min.toString()||'30';}
var max_bitrate="2500";if(params.max){max_bitrate=params.max.toString()||'2500';}
var codecIndex=findLine(sdpLines,'a=rtpmap',codec+'/90000');var codecPayload;if(codecIndex){codecPayload=getCodecPayloadType(sdpLines[codecIndex]);}
if(!codecPayload){return sdp;}
var rtxIndex=findLine(sdpLines,'a=rtpmap','rtx/90000');var rtxPayload;if(rtxIndex){rtxPayload=getCodecPayloadType(sdpLines[rtxIndex]);}
if(!rtxIndex){sdpLines[mLineIndex]+='\r\nb=AS:'+max_bitrate;sdp=sdpLines.join('\r\n');return sdp;}
var rtxFmtpLineIndexChromium=findLine(sdpLines,'a=fmtp:'+rtxPayload.toString());if(rtxFmtpLineIndexChromium!==null){var appendrtxNext='\r\n';appendrtxNext+='a=fmtp:'+codecPayload+' x-google-min-bitrate='+min_bitrate+'; x-google-max-bitrate='+max_bitrate;sdpLines[rtxFmtpLineIndexChromium]=sdpLines[rtxFmtpLineIndexChromium].concat(appendrtxNext);sdp=sdpLines.join('\r\n');}
return sdp;}
function setOpusAttributes(sdp,params,debug=false){params=params||{};var sdpLines=sdp.split('\r\n');var opusIndex=findLine(sdpLines,'a=rtpmap','opus/48000');var opusPayload;if(opusIndex){opusPayload=getCodecPayloadType(sdpLines[opusIndex]);}
if(!opusPayload){return sdp;}
var opusFmtpLineIndex=findLine(sdpLines,'a=fmtp:'+opusPayload.toString());if(opusFmtpLineIndex===null){return sdp;}
var appendOpusNext='';if(typeof params.minptime!='undefined'){if(params.minptime!=false){appendOpusNext+=';minptime:'+params.minptime;}}
if(typeof params.maxptime!='undefined'){if(params.maxptime!=false){appendOpusNext+=';maxptime:'+params.maxptime;}}
if(typeof params.ptime!='undefined'){if(params.ptime!=false){appendOpusNext+=';ptime:'+params.ptime;}}
if(typeof params.stereo!='undefined'){if(params.stereo==0){sdpLines[opusFmtpLineIndex]=sdpLines[opusFmtpLineIndex].replace(";stereo=1","");sdpLines[opusFmtpLineIndex]=sdpLines[opusFmtpLineIndex].replace(";sprop-stereo=1","");sdpLines[opusFmtpLineIndex]=sdpLines[opusFmtpLineIndex].replace(";stereo=0","");sdpLines[opusFmtpLineIndex]=sdpLines[opusFmtpLineIndex].replace(";sprop-stereo=0","");if(sdpLines[opusFmtpLineIndex].split(";stereo=0").length==1){appendOpusNext+=';stereo=0';}
if(sdpLines[opusFmtpLineIndex].split(";sprop-stereo=0").length==1){appendOpusNext+=';sprop-stereo=0';}}else if(params.stereo==1){sdpLines[opusFmtpLineIndex]=sdpLines[opusFmtpLineIndex].replace(";stereo=1","");sdpLines[opusFmtpLineIndex]=sdpLines[opusFmtpLineIndex].replace(";sprop-stereo=1","");sdpLines[opusFmtpLineIndex]=sdpLines[opusFmtpLineIndex].replace(";stereo=0","");sdpLines[opusFmtpLineIndex]=sdpLines[opusFmtpLineIndex].replace(";sprop-stereo=0","");if(sdpLines[opusFmtpLineIndex].split(";stereo=1").length==1){appendOpusNext+=';stereo=1';}
if(sdpLines[opusFmtpLineIndex].split(";sprop-stereo=1").length==1){appendOpusNext+=';sprop-stereo=1';}}else if(params.stereo==2){sdpLines[opusFmtpLineIndex]=sdpLines[opusFmtpLineIndex].replace(";stereo=1","");sdpLines[opusFmtpLineIndex]=sdpLines[opusFmtpLineIndex].replace(";sprop-stereo=1","");sdpLines[opusFmtpLineIndex]=sdpLines[opusFmtpLineIndex].replace(";stereo=0","");sdpLines[opusFmtpLineIndex]=sdpLines[opusFmtpLineIndex].replace(";sprop-stereo=0","");sdpLines[opusIndex]=sdpLines[opusIndex].replace("opus/48000/2","multiopus/48000/6");if(sdpLines[opusFmtpLineIndex].split(";channel_mapping=0,4,1,2,3,5;num_streams=4;coupled_streams=2").length==1){appendOpusNext+=';channel_mapping=0,4,1,2,3,5;num_streams=4;coupled_streams=2';}}else if(params.stereo==3){sdpLines[opusFmtpLineIndex]=sdpLines[opusFmtpLineIndex].replace(";stereo=1","");sdpLines[opusFmtpLineIndex]=sdpLines[opusFmtpLineIndex].replace(";sprop-stereo=1","");sdpLines[opusFmtpLineIndex]=sdpLines[opusFmtpLineIndex].replace(";stereo=0","");sdpLines[opusFmtpLineIndex]=sdpLines[opusFmtpLineIndex].replace(";sprop-stereo=0","");sdpLines[opusIndex]=sdpLines[opusIndex].replace("opus/48000/2","multiopus/48000/8");if(sdpLines[opusFmtpLineIndex].split(";channel_mapping=0,6,1,2,3,4,5,7;num_streams=5;coupled_streams=3").length==1){appendOpusNext+=';channel_mapping=0,6,1,2,3,4,5,7;num_streams=5;coupled_streams=3';}}}
if(typeof params.maxaveragebitrate!='undefined'){if(sdpLines[opusFmtpLineIndex].split("maxaveragebitrate=").length==1){appendOpusNext+=';maxaveragebitrate='+params.maxaveragebitrate;}}
if(typeof params.maxplaybackrate!='undefined'){if(sdpLines[opusFmtpLineIndex].split("maxplaybackrate=").length==1){appendOpusNext+=';maxplaybackrate='+params.maxplaybackrate;}}
if(typeof params.cbr!='undefined'){if(sdpLines[opusFmtpLineIndex].split("cbr=").length==1){appendOpusNext+=';cbr='+params.cbr;}}
if(typeof params.dtx!='undefined'){if(params.dtx){if(sdpLines[opusFmtpLineIndex].split("usedtx=").length==1){appendOpusNext+=';usedtx=1';}}}
if(typeof params.useinbandfec!='undefined'){if(sdpLines[opusFmtpLineIndex].split("useinbandfec=").length==1){appendOpusNext+=';useinbandfec='+params.useinbandfec;}else{sdpLines[opusFmtpLineIndex]=sdpLines[opusFmtpLineIndex].replace("useinbandfec="+(params.useinbandfec?0:1),"useinbandfec="+params.useinbandfec);}}
sdpLines[opusFmtpLineIndex]=sdpLines[opusFmtpLineIndex].concat(appendOpusNext);if(debug){console.log("Adding to SDP (audio): "+appendOpusNext+" --> Result: "+sdpLines[opusFmtpLineIndex]);}
sdp=sdpLines.join('\r\n');return sdp;}
function getOpusBitrate(sdp){var sdpLines=sdp.split('\r\n');var opusIndex=findLine(sdpLines,'a=rtpmap','opus/48000');var opusPayload;if(opusIndex){opusPayload=getCodecPayloadType(sdpLines[opusIndex]);}
if(!opusPayload){return 0;}
var opusFmtpLineIndex=findLine(sdpLines,'a=fmtp:'+opusPayload.toString());if(opusFmtpLineIndex===null){return 0;}
var appendOpusNext='';if(sdpLines[opusFmtpLineIndex].split("maxaveragebitrate=").length>1){var tmp=sdpLines[opusFmtpLineIndex].split("maxaveragebitrate=")[1];tmp=tmp.split('\r')[0];tmp=tmp.split('\n')[0];tmp=tmp.split(';')[0];tmp=parseInt(tmp);return tmp;}
return 32768;}
function modifyDescLyra(modifiedSDP){if(!modifiedSDP.includes("m=audio")){return modifiedSDP;}
modifiedSDP=modifiedSDP.replace("SAVPF 111","SAVPF 109 111").replace("a=rtpmap:111","a=rtpmap:109 L16/16000/1\r\na=fmtp:109 ptime=20\r\na=rtpmap:111");modifiedSDP=modifiedSDP.replace("a=rtpmap:106 CN/32000\r\n","").replace("a=rtpmap:105 CN/16000\r\n","").replace("a=rtpmap:13 CN/8000\r\n","").replace(" 106 105 13","");return modifiedSDP;}
function modifyDescPCM(modifiedSDP,rate=32000,stereo=false,ptimeOverride=false){if(!modifiedSDP.includes("m=audio")){return modifiedSDP;}
var ptime=10;if(ptimeOverride){ptime=parseInt(ptimeOverride);}
ptime=parseInt(ptime/10)*10;if(ptime<10){ptime=10;}
rate=parseInt(rate)||32000;if(!stereo&&(rate>=48000)){rate=48000;ptime=10;}else if(!stereo&&rate>=44100){rate=44100;ptime=10;}else if(rate>=32000){rate=32000;if(stereo){ptime=10;}else if(ptime>20){ptime=20;}}else if(rate>=16000){rate=16000;if(stereo){if(ptime>20){ptime=20;}}else if(ptime>40){ptime=40;}}else{rate=8000;if(stereo){if(ptime>40){ptime=40;}}}
if(stereo){modifiedSDP=modifiedSDP.replace("SAVPF 111","SAVPF 109 111").replace("a=rtpmap:111","a=rtpmap:109 L16/"+rate+"/2\r\na=fmtp:109 ptime="+ptime+"\r\na=rtpmap:111");}else{modifiedSDP=modifiedSDP.replace("SAVPF 111","SAVPF 109 111").replace("a=rtpmap:111","a=rtpmap:109 L16/"+rate+"/1\r\na=fmtp:109 ptime="+ptime+"\r\na=rtpmap:111");}
modifiedSDP=modifiedSDP.replace("a=rtpmap:106 CN/32000\r\n","").replace("a=rtpmap:105 CN/16000\r\n","").replace("a=rtpmap:13 CN/8000\r\n","").replace(" 106 105 13","");return modifiedSDP;}
return{disableNACK:disableNACK,disablePLI:disablePLI,disableREMB:disableREMB,modifyDescPCM:modifyDescPCM,modifyDescLyra:modifyDescLyra,getVideoBitrates:function(sdp){return getVideoBitrates(sdp);},setVideoBitrates:function(sdp,params,codec){return setVideoBitrates(sdp,params,codec);},setOpusAttributes:function(sdp,params,debug=false){return setOpusAttributes(sdp,params,debug);},getOpusBitrate:function(sdp){return getOpusBitrate(sdp);},preferCodec:preferCodec,preferAudioCodec:preferAudioCodec};})();