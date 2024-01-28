import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Header extends Component {
    
    componentDidMount() {

        $('body').attr('id',"page-top");
        $('body').attr('class',"index");
        
        //TODO - refactor to ES2016
        
        var cbpAnimatedHeader = (function() {
            var docElem = document.documentElement,
                header = document.querySelector( '.navbar-fixed-top' ),
                didScroll = false,
                changeHeaderOn = 300;
    
            function init() {
                window.addEventListener( 'scroll', function( event ) {
                    if( !didScroll ) {
                        didScroll = true;
                        setTimeout( scrollPage, 250 );
                    }
                }, false );
            }
    
            function scrollPage() {
                var sy = scrollY();
                if ( sy >= changeHeaderOn ) {
                    classie.add( header, 'navbar-shrink' );
                }
                else {
                    classie.remove( header, 'navbar-shrink' );
                }
                didScroll = false;
            }
    
            function scrollY() {
                return window.pageYOffset || docElem.scrollTop;
            }
    
            init();
    
        })();
        
        // jQuery for page scrolling feature - requires jQuery Easing plugin
        $(function() {
            $('body').on('click', '.page-scroll a', function(event) {
                Meteor.call("clientLog", "page-scroll link clicked", Meteor.userId());
                var $anchor = $(this);

                $('html, body').stop().animate({
                    scrollTop: $($anchor.attr('href')).offset().top
                }, 1500, 'easeInOutExpo', () => {
                    $('li.page-scroll.active a:focus').blur();
                    $('div.navbar-header.page-scroll a:focus').blur();
                });
                
                event.preventDefault();
            });
        });
    }
    
    getPortalLink() {
        if(Meteor.settings.public.env === "Preview") {
            return null
        } else {
            return (
                <Link to="/portal" className="btn btn-lg btn-outline">
                    <span>SISENE ENNUSTUSLEHELE <i className="fa fa-sign-in-alt" aria-hidden="true"></i></span>
                </Link>
            )
        }
    }

    render() {
        return (
            <header>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <img className="img-responsive" src="images/landing/profile.png" alt="" />
                            <div id="login" className="loginlanding">
                                {this.getPortalLink()}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        )
    }
}