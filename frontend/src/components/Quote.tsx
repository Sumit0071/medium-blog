import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const Quote = () => {
    const [quote, setQuote] = useState( '' );
    const [author, setAuthor] = useState( '' );
    const [genre, setGenre] = useState( '' );
    const [category, setCategory] = useState( 'computers' );
    const apiKey = import.meta.env.VITE_QUOTE_API_KEY;

    function getRandomChoice( category1: string, category2: string ) {
        return Math.random() < 0.5 ? category1 : category2;
    }

    useEffect( () => {
        const chosenCategory = getRandomChoice( "computers", "happiness" );
        setCategory( chosenCategory );
    }, [] );

    useEffect( () => {
        async function fetchQuote() {
            try {
                const response = await axios.get( `https://api.api-ninjas.com/v1/quotes?category=${category}`, {
                    headers: { 'X-Api-Key': apiKey }
                } );
                setQuote( response.data[0]?.quote || '' );
                setAuthor( response.data[0]?.author || '' );
                setGenre( response.data[0]?.category || '' );

                console.log( response.data );
            } catch ( error: any ) {
                console.error( 'Error: ', error.response ? error.response.data : error.message );
            }
        }

        if ( category ) {
            const debounceFetch = setTimeout( fetchQuote, 1000 );
            return () => clearTimeout( debounceFetch );
        }
    }, [category, apiKey] );

    return (
        <div className="bg-slate-200 h-screen flex flex-col justify-center">
            <div className="flex justify-center flex-col mx-auto">
                <div className="max-w-md text-cl font-semibold text-slate-400 mt-4 mx-6">
                    {genre ? `"${genre}"` : ' Happiness'}
                </div>
                <div className="max-w-md text-center text-3xl font-bold">
                    {quote ? `"${quote}"` : `" Customer service I received was fabulous"`}
                </div>
                <div className="max-w-md text-cl font-semibold text-slate-400 mt-4 mx-6">
                    {author ? `" - ${author}"` : ' - John Doe'}
                </div>
            </div>
        </div>
    );
};
