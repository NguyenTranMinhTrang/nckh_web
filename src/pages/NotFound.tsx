import React from 'react';
import { Link } from 'react-router-dom';
import { notfound } from '../constants/images';

const NotFound = () => (
    <div>
        <div className="flex h-screen items-center justify-center">
            <div>
                <div className='flex items-center justify-center'>
                    <img
                    src={notfound}
                    alt="not-found"
                    className=''
                    />
                </div>
                <div className='text-center	'>
                    <p className='font-serif text-5xl/[50px]'>He he he, <b>404 Not Found</b> nha ní!</p>
                    <p className='font-serif text-2xl/[50px]'> 
                        <Link to="/" className="link-home">
                            <a>Click vô đây quay về nè!</a>
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export default NotFound;