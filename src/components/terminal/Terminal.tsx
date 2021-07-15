import { makeStyles } from '@material-ui/core';
import { File } from './File';
import React, { useState } from 'react';
import homeArray, { fileArr } from './info';

import { getRequiredArray, addFile, deleteFile } from './utils/fileInsert';
import { checkServerIdentity } from 'tls';
import { isValidDirectory, getChangedDirectoryName, getDirectoryName } from './terminalUtils';


import TerminalBar from './TerminalBar';

const useStyles = makeStyles(theme => ({
    terminalContainer: {
        backgroundColor: "#1e1e1e",
        display: "grid",
        margin: "auto",
        width: "75%",
        
        color: "white",
        outline: "none",
        textShadow: "0 0 0 gray",
        fontSize: "1rem",
        fontFamily: "monospace",
        fontWeight: 200,
        minHeight:"400px",
        boxShadow:"10px 5px 10px lightgray;",
        /* maxHeight:"500px",
        maxWidth: "90%",
        overFlow: "scroll" */
        alignItems:"flex-start", alignContent:"flex-start",



    },
    commandInput: {
        background: "#1e1e1e",
        outline: "none",
        border: "none",
        color: "white",
        maxWidth:"100%",
        textShadow: "0 0 0 gray",
        fontSize:"1rem",
        fontFamily: "monospace",
        fontWeight: 200,
        
        "&:focus": {
            outline: "0px solid transparent;",
            border: "none"
        }
    },
    directoryStyle:{
        color:"greenyellow",
        margin: "0px"
    },
    fileStyle:{
        margin: "0px",
        color: "yellow"
    }

    
    
}));

const Terminal: React.FC = () => {
    
    const classes = useStyles({});
    const [workingArr,setWorkingArr] = useState(homeArray);
    const [workingDir, setWorkingDir] = useState('/')
    const [cmdInput, setCmdInput] = useState('help');
    const [results, setResults] = useState<JSX.Element[]>([]);
    



    const handleInputChange = (e: any) => { // for recording user input in the terminal
        //console.log(fileArr);
        //console.log(e.target.value);
        setCmdInput(e.target.value);
        e.target.style.width = e.target.value.length + 10 + "ch";
    };

    function getCommandArgs(command: string): string[] {
        let arr = command.split(" ").filter((e) => (e !== ''));
        return arr;
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && cmdInput!="" && cmdInput!=null) {
            e.preventDefault();
            
            //parseCommand(cmdInput); complete this function 
            //parse only if it is not empty command
            console.log("Enter Key pressed")
            var input = cmdInput;
            
            const toPush: JSX.Element =  <div style={{  textAlign: "left" }}>
                <span> user@web:<span style={{ color: "#2d84ea" }}>~{workingDir}</span> $ &gt; {" "} {cmdInput}</span>
            </div>

            results.push(toPush)

            if(cmdInput=="" || cmdInput==null) {
                setResults(results);
                return;
            };
            parseCommand(input);
            
            setCmdInput("");
        }
        else if(e.key==="Tab"){
            e.preventDefault();

            console.log("tab pressed")
            console.log("command input is ", cmdInput)
            

        }
    }
    //outputs and add the the files to be displayed on terminal output to Reuslts array 
    function terminalOutput(FileArray: File[]): JSX.Element {

        const arr = FileArray.map((file: File) => {
            return (
                <p style={{ margin: "5px 10px", padding: "0px" }}>
                    <span className={ file.getType()==='directory'?classes.directoryStyle:classes.fileStyle}>{file.getName()} </span>
                </p>
            )
        })
        const arr1 = [arr];

        /* console.log("The arrays is " );
        console.log(arr1); */
        const returnElement: JSX.Element = <div style={{ display: "inline-flex", alignItems:"flex-start", alignContent:"flex-start", margin:"0px",padding:"0px", columnCount: 3, flexWrap: "wrap" }}>
            {arr}
        </div>

        results?.push(returnElement)
        //console.log("results: ", results);
        return returnElement;

    }

    function changeDirectory(dir:string){
        console.log("Change dir name:" , dir);
        if(dir){

            if(isValidDirectory(workingDir,dir)){
                setWorkingDir(prev=> {
                    const newDir = getDirectoryName(prev,dir);
                    console.log("changing working dir  to " , newDir);
                    setWorkingArr(lul=>{
                        const newArr :File[]= getRequiredArray(newDir,homeArray,0);
                        console.log("changing working arr to :",newArr)
                        return newArr;
                    });
                    return newDir;
                })
                    
                

            }else{
                const returnElement: JSX.Element = <div style={{ display: "inline-flex", flexWrap: "wrap", marginLeft:"10px", }}>
                    <span> No Such directory found. Use the command <span>mkdir</span> to create a directory</span>
                    </div>
                results?.push(returnElement)   
            }
            
        }else{
            setWorkingDir(prev=>{
                
                setWorkingArr(homeArray);
                return '/';
            })

            return;
        }
    }

    function showFileContent(file:string){
        //check each file in working arr, if exits, write output to terminal
        var fileFound:boolean = false;
        workingArr.forEach(fileInArr=>{

            if(fileInArr.getName()===file){
                fileFound = true;
                if(fileInArr.getType()==='file'){
                    
                    const returnElement: JSX.Element = <div style={{ display: "inline-flex", flexWrap: "wrap", marginLeft:"10px" }}>
                    <span> {fileInArr.getData()}</span>
                    </div>
                    results?.push(returnElement);

                }

                else{

                    const returnElement: JSX.Element = <div style={{ display: "inline-flex", flexWrap: "wrap", marginLeft:"10px" }}>
                    <span> {fileInArr.getName()} is a directory. Use the command <span>cd</span> to look at the directory</span>
                    </div>
                    
                    results?.push(returnElement)   
                
                    return;

                }
                
            }
        })

        //file doesn't exits return error
        if(!fileFound){
            const returnElement: JSX.Element = <div style={{ display: "inline-flex", flexWrap: "wrap", marginLeft:"10px" }}>
                    <span> No Such file found. Use the command <span>touch</span> to create a file</span>
                    </div>
            results.push()
            results?.push(returnElement)   
        }
         
    }

    const parseCommand = (command: string) => {

        let inputs: string[] = getCommandArgs(command);
        //console.log("parsing commands" , inputs);
        console.log("Arguments are", inputs);

        const cmd = inputs[0];
        const file = inputs[1];


        switch (cmd) {

            case 'cd': {
                
                changeDirectory(file)
                break;
            }
            case 'ls': {
                terminalOutput(workingArr);
                break;
            }

            case 'mkdir': {
                break;
            }

            case 'touch': {
                terminalOutput(getRequiredArray("/experience", homeArray, 0));
                break;
            }

            case 'clear': {
                setResults([])
                break;
            }

            case 'cat': {
                showFileContent(file);
                break;
            }
        }

    }






    return (

        <div>
            <h2>Testing terminal</h2>
            
            <div className={classes.terminalContainer}>
            <TerminalBar />

                {
                    results.map(result => {
                        return result;
                    })
                }
                <span style={{ textAlign: "left" }}> user@web:<span style={{ color: "#2d84ea" }}>~{workingDir}</span> $ &gt; {" "}
                    <input type="text"
                        id="cmdInput"
                        className={classes.commandInput}
                        onChange={handleInputChange}
                        value={cmdInput}
                        onKeyDown={e => handleKeyDown(e)}>
                    </input>
                </span>

            </div>
        </div>
    );
}

export default Terminal;