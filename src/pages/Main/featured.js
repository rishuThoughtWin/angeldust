import React, { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

import Art from '../../assets/img/category/1.png'
import Music from '../../assets/img/category/2.png'
import Domain from '../../assets/img/category/domain.png'
import Sports from '../../assets/img/category/sports.png'
import Utility from '../../assets/img/category/utility.png'
import All from '../../assets/img/category/all.png';
import Heart from "../../assets/img/icons/heart.png";
import Slider from "react-slick";
import Partner1 from "../../assets/img/partner/1.png";
import Partner2 from "../../assets/img/partner/2.png";
import Partner3 from "../../assets/img/partner/3.png";
import Partner4 from "../../assets/img/partner/4.png";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Featured() {
  const [maxNft, setMaxNft] = useState({})
  const [follow, setFollow] = useState(maxNft?.likes)
  const [loading, setLoading] = useState(false)
  const { account } = useWeb3React()
  const [list, setList] = useState([])


  const getTokenInfo = (url) => {
    return new Promise((resolve, reject) => {
      fetch(url)
        .then((res) => res.json())
        .then((result) => {
          resolve(result)
        })
        .catch((err) => reject(err))
    })
  }


  var settings = {
    dots: false,
    infinite: true,
    autoplay: true,
    speed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
          dots: true,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        }
      }
    ]
  };


  var settings1 = {
    dots: false,
    infinite: false,
    autoplay: true,
    speed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 2,
          dots: true,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        }
      }
    ]
  };


  return (
    <div>
      
      {/* Partner */}
      <div className="partner_div pt-md-5 pb-md-5">
        <h2 className="same_heading">
          Partners
        </h2>

        <div>

          <Slider {...settings}>
            <div>
              <div className='partner_main'>
                <div className='partner_img'>
                  <img src={Partner1} />
                </div>
                <h4 className="mb-0">
                  Pink Sale
                </h4>
              </div>
            </div>
            <div>
              <div className='partner_main'>
                <div className='partner_img'>
                  <img src={Partner2} />
                </div>
                <h4 className="mb-0">
                  Cloud Chat
                </h4>
              </div>
            </div>
            <div>
              <div className='partner_main'>
                <div className='partner_img'>
                  <img src={Partner3} />
                </div>
                <h4 className="mb-0">
                  Crypto Kid Finance
                </h4>
              </div>
            </div>

            <div>
              <div className='partner_main'>
                <div className='partner_img'>
                  <img src={Partner4} />
                </div>
                <h4 className="mb-0">
                  Galaxy Heroes
                </h4>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </div>

  )
}

export default Featured
