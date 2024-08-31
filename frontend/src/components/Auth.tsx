import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signUpInput } from "@sumit_adhikari/medium-common";
import axios from "axios";
import { toast } from 'react-toastify';

export const Auth = ( { type }: { type: "signup" | "signin" } ) => {
    const notify = () => toast.success( type === "signup" ? "User Sign Up successful" : "User Sign In successful" );
    const navigate = useNavigate();
    const [postInputs, setPostInputs] = useState<signUpInput>( {
        name: "",
        username: "",
        password: ""
    } );

    async function sendRequest() {
        const backUri = import.meta.env.VITE_BACKEND_URL;
        console.log( backUri );
        try {
            const response = await axios.post( `${backUri}/api/v1/user/${type === "signup" ? "signup" : "signin"}`, postInputs );
            const jwt = response.data;
            localStorage.setItem( "token", jwt );
            notify();
            navigate( type === "signup" ? "/signin" : "/" );
        }
        catch ( e ) {
            toast.error( "Error during Sign Up or Sign In" );
            console.error( e );
        }
    }

    return (
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center flex-col items-center">
                <div className="text-3xl font-bold mb-2">
                    {type === "signup" ? "Create an account" : "Sign In into account"}
                </div>
                <div className="text-sm text-slate-400">
                    {type === "signin" ? "Don't have an account?" : "Already have an account?"}
                    <Link className="pl-2 underline" to={type === "signin" ? "/signup" : "/signin"}>
                        {type === "signup" ? "Sign In" : "Sign Up"}
                    </Link>
                </div>
            </div>
            <div className="flex flex-col py-4 gap-3 px-10">
                {type === "signup" ? (
                    <LabelledInput
                        label="Name"
                        placeholder="John Doe..."
                        onChange={( e ) => {
                            setPostInputs( c => ( {
                                ...c,
                                name: e.target.value
                            } ) );
                        }}
                    />
                ) : null}
                <LabelledInput
                    label="Username"
                    placeholder="Johndoe@gmail.com ..."
                    onChange={( e ) => {
                        setPostInputs( c => ( {
                            ...c,
                            username: e.target.value
                        } ) );
                    }}
                />
                <LabelledInput
                    label="Password"
                    type="password"
                    placeholder="password"
                    onChange={( e ) => {
                        setPostInputs( c => ( {
                            ...c,
                            password: e.target.value
                        } ) );
                    }}
                />
                <button
                    type="button"
                    onClick={sendRequest}
                    className="text-white mt-2 bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
                >
                    {type === "signup" ? "Sign Up" : "Sign In"}
                </button>
            </div>
        </div>
    );
};

interface LabelledInputType {
    label: string;
    placeholder: string;
    onChange: ( e: ChangeEvent<HTMLInputElement> ) => void;
    type?: string;
}

function LabelledInput( { label, placeholder, onChange, type }: LabelledInputType ) {
    return (
        <div>
            <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{label}</label>
            <input
                onChange={onChange}
                type={type || "text"}
                id="first_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder={placeholder}
                required
            />
        </div>
    );
}
