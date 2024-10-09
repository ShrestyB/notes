import React, { useRef, useEffect, useState } from "react";
import './NoteBody.css'; 
import Tooltip from '@mui/material/Tooltip';

export function NoteBody({ note, setNote, setNewNoteFlag }) {
    const textAreaRef = useRef(null);
    const [inferredWords, setInferredWords] = useState({});

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "20px";
            textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
        }
    }, [note]);

    useEffect(() => {
        inferWordMeanings(note.body); // Call API when note body changes
    }, [note.body]);

    const API_URL = 'https://api-inference.huggingface.co/models/deepset/roberta-base-squad2';
    const API_KEY = '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';

    // Function to extract key terms from the note
    const extractKeyTerms = (text) => {
        const stopwords = ["the", "is", "in", "and", "or", "of", "to", "a", "that", "it", "this", "for", "on", "with"]; // Add more stopwords as needed
        const words = text.split(/\s+/);
        return words.filter(word => !stopwords.includes(word.toLowerCase()));
    };

    async function inferWordMeanings(context) {
        const keyTerms = extractKeyTerms(context);
        const newInferredWords = {};

        for (const term of keyTerms) {
            try {
                const response = await fetch(API_URL, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        inputs: {
                            question: `What does "${term}" mean in this text?`,
                            context: context,
                        },
                    }),
                });

                const result = await response.json();
                if (result && result.answer) {
                    newInferredWords[term] = result.answer; // Store the inferred meaning
                }
            } catch (error) {
                console.error("Error fetching from Hugging Face:", error);
            }
        }

        setInferredWords(newInferredWords); // Update the state with inferred meanings
    }

    function expandNewNote() {
        if (setNewNoteFlag !== undefined) {
            setNewNoteFlag(true); // Indicate new note
        }
    }

    function saveNoteBody(e) {
        expandNewNote();
        setNote((currentNote) => ({
            ...currentNote,
            body: e.target.innerHTML, // Save content with rich text (HTML)
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

    // Function to dynamically render text with Tooltip
    const renderWithTooltips = (text) => {
        const words = text.split(' ');
        return words.map((word, index) => {
            if (inferredWords[word]) {
                return (
                    <Tooltip title={inferredWords[word]} key={index}>
                        <span style={{ textDecoration: "underline", cursor: "pointer", color: "blue" }}>
                            {word}
                        </span>
                    </Tooltip>
                );
            }
            return <span key={index}>{word} </span>;
        });
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
                contentEditable="false" // Disable direct editing here
                onClick={expandNewNote}
                ref={textAreaRef}
            >
                {renderWithTooltips(note.body)} {/* Render text with tooltips */}
            </div>
        </>
    );
}
