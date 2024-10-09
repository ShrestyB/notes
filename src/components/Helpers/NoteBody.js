import React, { useRef, useEffect, useState } from "react";
import './NoteBody.css'; 
import axios from 'axios'


export function NoteBody({ note, setNote, setNewNoteFlag }) {
    const textAreaRef = useRef(null);
    const [insights,setInsights]=useState(null);

    useEffect(() => { 
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "20px";
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
        }
    }, [note]);

    function expandNewNote() {
        if (setNewNoteFlag !== undefined) {
            setNewNoteFlag(true); // Indicate new note
        }
    }

    useEffect(()=>{
        if(note.body){
            fetchInsights(note.body)
            }
        
        },[note.body]);
    



async function fetchInsights(content) {
    try {
        const options = {
            method: 'POST',
            url: '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', // Replace with actual endpoint
            headers: {
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': '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',
                'X-RapidAPI-Host': 'http://localhost:3000/'
            },
            data: { text: content } // The note content to be analyzed
        };

        const response = await axios.request(options);
        setInsights(response.data); // Store insights in state
    } catch (error) {
        console.error("Error fetching insights:", error);
    }
}
    function saveNoteBody(e) {
        expandNewNote();
        setNote((currentNote) => ({
            ...currentNote,
            body: e.target.innerHTML, 
            // Save content with rich text (HTML)
            lastEdited: Date.now(),
        }));

        if (setNewNoteFlag) {
            setNewNoteFlag(false); 
        }
    }

    function applyStyle(style) {
        document.execCommand(style, false, null); // Applies the formatting style
        textAreaRef.current.focus(); 
    }

    const alignText = (alignment) => {
        document.execCommand('justify' + alignment, false, null); // Align text
        textAreaRef.current.focus();
    };

    const changeFontSize = (size) => {
        document.execCommand("fontSize", false, "5");
        const spans = document.getElementsByTagName("span");
        for (let i = 0; i < spans.length; i++) {
            spans[i].style.fontSize = size; 
        }
        textAreaRef.current.focus();
    };

    return (
        <>
            <div className="formatting-buttons">
                <button onClick={() => applyStyle("bold")} title="Bold">
                    <strong>B</strong>
                </button>
                <button onClick={() => applyStyle("italic")} title="Italic">
                    <em>I</em>
                </button>
                <button onClick={() => applyStyle("underline")} title="Underline">
                    <u>U</u>
                </button>
                <button onClick={() => alignText("Left")} title="Align Left">
                    Left
                </button>
                <button onClick={() => alignText("Center")} title="Align Center">
                    Center
                </button>
                <button onClick={() => alignText("Right")} title="Align Right">
                    Right
                </button>
                <button onClick={() => alignText("Justify")} title="Justify">
                    Justify
                </button>
                <button>
                <select onChange={(e) => changeFontSize(e.target.value)} title="Font Size">
                    <option value=""></option>
                    <option value="18px">18px</option>
                    <option value="20px">20px</option>
                    <option value="22px">22px</option>
                </select>
                </button>
                
            </div>
            <div
                className="note-taker-body"
                contentEditable="true" 
                // Enable rich text editing
                onClick={expandNewNote}
                onChange={saveNoteBody} 
                ref={textAreaRef}
                dangerouslySetInnerHTML={{ __html: note.body }} // Load saved rich text
            />
        </>
    );
}

