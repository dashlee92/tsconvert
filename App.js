import React,{useEffect,useState,useRef} from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View,Button, Alert } from 'react-native';
import HTML from 'react-native-render-html'
import Axios from 'axios'
// import {useState,useEffect} from 'React'
import WebView from 'react-native-webview';
import {Picker} from '@react-native-picker/picker'

export default function App() {
  return (
    <ConvertApp />
  )
}

const ConvertApp = ()=>{
  const [inputText, setInputText] = React.useState('')
  const [tragetText, setTargetText] = useState('')
  const [errMsg, setErrMsg] = useState('')
  const inputRef = useRef(null)
  const [pieces, setPieces] = useState([])
  const [mode, setMode] = useState('t')

  const tsconvert = (input) =>{
    setMode('s')
    const url = `https://test.sou-yun.cn/api/tsconvert?input=${encodeURIComponent(input)}`
    Axios.get(url).then(res=>{
      setTargetText(res.data.SimplifiedText)
    }).catch(err=>{
      setErrMsg('出错了,错误信息：'+ JSON.stringify(err) )
    })
  }

  const stconvert = (input) =>{
    setMode('t')
    const url = `https://test.sou-yun.cn/api/stconvert?input=${encodeURIComponent(input)}` 
    Axios.get(url).then(res=>{
      setPieces(res.data.Pieces)
    }).catch(err=>{
      setErrMsg('出错了,错误信息：'+ JSON.stringify(err) )
    })
  }

  const clearErrorMessage= ()=> {
    setErrMsg('')
  }

  function renderPieces(pieces){
    let el = <Text></Text>
    for(var i = pieces.length-1 ;i>= 0;i--){
      var piece = pieces[i]
      if(piece.Options && piece.Options.length){
        el = <Text><Text style={{color:'red',fontSize:22}}>{piece.Options[0].TraditionalChars[0]}</Text>{el}</Text>
      }else{
        el = <Text style={{color:'black',fontSize:20}}>{piece.Target}{el}</Text>
      }
      if(i == 0){
        return <View style={{fontSize:22}}>{el}</View>
      }
    }
  }

  return (
    <View style={{padding:20}}>
      <View style={{marginBottom:20,marginTop:20}}>
       <Text style={styles.title}>请输入文字</Text>
        <TextInput 
          ref={inputRef} 
          numberOfLines={10} 
          placeholder='请在此输入或粘贴文字'
          multiline 
          editable
          style={styles.textInput} 
          textAlignVertical='top'
          returnKeyLabel='转换'
          onChangeText={(_text)=>{
          console.log('input', _text)
          setInputText(_text)
        }}
        />
        <View style={styles.fixToText}>
          <Button title='转简体'
            onPress={()=>{
              setPieces([])
              clearErrorMessage()
              inputRef.current.blur()
              tsconvert(inputText)
          }}/>
          <Button title='轉繁體'
            onPress={()=>{
              setPieces([])
              clearErrorMessage()
              inputRef.current.blur()
              stconvert(inputText)
          }}/>
          <Button title='清空'
            color='maroon'
            onPress={()=>{
              setTargetText('')
              inputRef.current.clear()
          }}/>
        </View>
        <View>
        </View>
      </View>
      {
        errMsg ? (
          <View><Text style={{color:'red',fontSize:20}}>{errMsg}</Text></View>
        ):
        tragetText||pieces.length>0?
        (
          <View style={{marginTop:20}}>
            <Text style={styles.resultTitle}>转换结果</Text>
            <ScrollView style={styles.convertedResultView}>
              {
                mode=='t' &&  
                renderPieces(pieces)
              }
              {
                mode=='s' &&
                <Text style={styles.resultContent}>{tragetText.toString()}</Text>
              }
            </ScrollView>
          </View>
        ):null
      }
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    paddingBottom: 5
  },
  textInput: {
    maxHeight:200,
    borderColor: 'green',
    borderWidth: 0.8,
    fontSize: 16,
    marginBottom: 12,
    overflow: 'hidden'
  },
  button: {
    marginTop: 12,
    marginBottom: 12
  },
  resultTitle: {
    fontSize: 18,
    color: 'black',
    paddingBottom: 5,
  },
  convertedResultView: {
    height: 300,
    overflow: 'scroll',
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: 'lightgray',
    // boxShadow: '3px 6px 6px rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 3,
      height: 6
    },
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    padding: 6
  },
  resultContent: {
    fontSize: 18,
    padding: 15
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});