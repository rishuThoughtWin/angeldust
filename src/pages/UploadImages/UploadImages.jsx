import { CreationSteps, Button } from "components";
import { UploadImageIcon } from "components";
// import { Container } from "components";
import { ShowImages } from "../ShowImages";
import React from "react";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { Link, useHistory } from "react-router-dom";

import "./uploadImages.css";
import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { toast } from "react-toastify";

export const UploadImages = (props) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  const handleOnChange = (files) => {
    if (files) {
      setImages(files);
      const randomNum = Math.floor(Math.random() * 10000001);
    }
  };
  ShowImages(images);

  const handleBack = () => {
    setImages([]);
  };

  return (
    <>
      {images.length > 0 ? (
        <ShowImages
          handleOnChange={handleOnChange}
          handleChain={props.handleChain}
          images={images}
          nftName={props.nftName}
          collectionName={props.collectionName}
          handleBack={handleBack}
        />
      ) : (
        <Container>
          <div className="image_drop">
            <div className="row">
              <div className="col-lg-9 col-md-12 col-12">
                <div className="drop_card mt-md-0 mt-5">
                  <div>
                    <label>Drop your NFT assets below to launch!</label>
                    <Dropzone onDrop={(files) => handleOnChange(files)}>
                      {({ getRootProps, getInputProps }) => (
                        <section>
                          <div {...getRootProps()}>
                            <input {...getInputProps()} />
                            <p className="drag_drop_filed">
                              <UploadImageIcon />
                              <label className="browse_file">
                                Drag & drop files or <Link>Browse</Link>
                              </label>
                              <p> Supported formates: JPEG, PNG</p>
                            </p>
                          </div>
                        </section>
                      )}
                    </Dropzone>
                  </div>
                </div>
                <div className="row mt-4 btn_images_collection">
                  <div className="col-md-6 col-6">
                    <Button
                      type="secondary"
                      onClick={() => {
                        handleBack();
                        props.handleUploadComponet("", props.nftName);
                      }}
                    >
                      Back
                    </Button>
                  </div>

                  <div className="col-md-6 col-6 text-right">
                    <Button
                      onClick={() => toast.error("Please select image directory")}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      )}
    </>
  );
};
