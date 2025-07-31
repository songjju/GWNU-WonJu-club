// src/components/BannerCarousel.js
import React from "react";
import { Carousel } from "react-bootstrap";
import "../Main_Style/BannerCarousel.css";
import "../Main_Style/Responsive.css";

const BannerCarousel = () => (
  <div className="carousel-container">
    <Carousel interval={3000}>
      <Carousel.Item>
        <img
          className="carousel-image"
          src="/photo/bannerimg1.jpg"
          alt="First slide"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="carousel-image"
          src="/photo/bannerimg2.jpg"
          alt="Second slide"
        />
      </Carousel.Item>
    </Carousel>
  </div>
);

export default BannerCarousel;
