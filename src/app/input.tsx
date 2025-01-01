"use client";
import { useState, useRef, useEffect } from 'react';

export default function Input({ children }: {
    children: React.ReactNode;
}) {
    const [inputValue, setInputValue] = useState<string | null>(null);
    const ref = useRef<HTMLDivElement>(null);

    let regex: RegExp | null = null;
    if (inputValue) {
        try {
            regex = new RegExp(inputValue, 'i');
        } catch (e) {
            if (e instanceof SyntaxError) {
                regex = null;
            } else {
                throw e;
            }
        }
    } else {
        regex = null;
    }

    useEffect(() => {
        if (ref.current) {
            if (regex !== null && regex.source.length > 3) {
                ref.current.querySelectorAll('g').forEach(g => {
                    const textElement = g.querySelector('text');
                    if (textElement) {
                        const name = textElement.textContent
                        if (name && regex.test(name)) {
                            g.classList.add('visible');
                        } else {
                            g.classList.remove('visible');
                        }
                    }
                });
            } else {
                ref.current.querySelectorAll('g').forEach(g => {
                    g.classList.remove('visible');
                });
            }
        }
    }, [regex]);

    return (
        <div ref={ref}>
            <input
                type="text"
                value={inputValue || ''}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Enter text"
            />
            {children}
        </div>
    );
}
