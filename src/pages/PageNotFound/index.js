import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
    <main className="main">
        <div className="hero_common creator_hero_main">
            <   div className="hero_border">
                <div className="container">
                    <div className="row row--grid mb-md-5 pb-md-4">
                        <div className="col-12">
                            <div className="main__title main__title--page text-center">
                                <h1>404 - Not Found!</h1>
                                <Link to="/">Go Home</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
);

export default NotFound;