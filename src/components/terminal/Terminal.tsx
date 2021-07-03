import { makeStyles } from '@material-ui/core';
import { File } from './File';
import React, { useState } from 'react';
import homeArray, { fileArr } from './info/index';

import { getRequiredArray, addFile, deleteFile } from './utils/fileInsert';
import { checkServerIdentity } from 'tls';

import { isValidDirectory, getChangedDirectoryName } from './terminalUtils';


const useStyles = makeStyles(theme => ({
    terminalContainer: {
        backgroundColor: "#1e1e1e",
        display: "grid",
        margin: "auto",
        width: "80%",
        border: "1px solid black",
        color: "white",
        outline: "none",
        textShadow: "0 0 0 gray",
        fontSize: "18px",
        fontFamily: "Consolas",
        fontWeight: 200,
        /* maxHeight:"500px",
        maxWidth: "90%",
        overFlow: "scroll" */



    },
    commandInput: {
        background: "#1e1e1e",
        outline: "none",
        border: "none",
        color: "white",
        textShadow: "0 0 0 gray",
        fontSize: "18px",
        fontFamily: "Consolas",
        fontWeight: 200,
        "&:focus": {
            outline: "0px solid transparent;",
            border: "none"
        }
    }
}));

const Terminal: React.FC = () => {
    const classes = useStyles({});

    const [workingDir, setWorkingDir] = useState('/home/dir')
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
        if (e.key === "Enter") {
            e.preventDefault();

            //parseCommand(cmdInput); complete this function 
            //parse only if it is not empty command
            console.log("Enter Key pressed")
            var input = cmdInput;
            parseCommand(input);
            setCmdInput("");
        }
    }
    //outputs and add the the files to be displayed on terminal output to Reuslts array 
    function terminalOutput(homeArray: File[]): JSX.Element {

        const arr = homeArray.map((file: File) => {
            return (
                <div style={{ margin: "5px 10px", padding: "0px" }}>
                    <p style={{ margin: "0px" }}>{file.getName()} </p>
                </div>
            )
        })
        const arr1 = [arr];

        /* console.log("The arrays is " );
        console.log(arr1); */

        const returnElement: JSX.Element = <div style={{ display: "inline-flex", columnCount: 3, flexWrap: "wrap" }}>
            {arr}
        </div>

        results?.push(returnElement)
        console.log("results: ", results);
        return returnElement;

    }

    function changeDirectory(dir:string){
        console.log("Change dir name:" , dir);
        
        
        if(dir){
            /* if(checkDir(dir)){

            } */
            isValidDirectory(workingDir,dir)
            
            //getRequiredArray(`${workingDir}/${dir}`,homeArray,0);
            setWorkingDir(`${workingDir}/${dir}`)
        }else{
            setWorkingDir('/')

            return;
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
                terminalOutput(homeArray);
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
                console.log("wow")
            }
        }

    }






    return (

        <div>
            <h1> Terminal</h1>

            <div className={classes.terminalContainer}>

                <input type="text"
                    id="cmdInput"
                    className={classes.commandInput}
                    onChange={handleInputChange}
                    value={cmdInput}
                    onKeyDown={e => handleKeyDown(e)}>
                </input>

            </div>

            <h2>Testing terminal</h2>

            <div className={classes.terminalContainer}>

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