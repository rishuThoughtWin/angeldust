import { Container } from "react-bootstrap";
import { useState, useEffect } from "react";
import { CreationSteps, Button } from "components";
import "./showImages.css";
import { launchpad_Collection_nft_create_with_images } from "apis";
import { BaseModal } from "components/Modal";
import { LoaderIcon } from "components";
import Dropzone from "react-dropzone";
import { UploadImageIcon } from "components";
import { Link } from "react-router-dom";

export const ShowImages = ({
  images,
  nftName,
  collectionName,
  handleBack,
  handleChain,
  handleOnChange,
}) => {
  const [showLoader, setShowLoader] = useState(false);
  const [imageNextArr, setImageNextArr] = useState(images);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleImageLoad = async () => {
    setShowLoader(true);
    try {
      const req = {
        collectionId: localStorage.getItem("collectionID"),
        files: imageNextArr,
      };
      const upload_images = await launchpad_Collection_nft_create_with_images(
        req
      );

      if (upload_images?.data?.success?.code==200) {
        handleChain();
        setShowLoader(false);
      }
      else{
        setShowLoader(false);
      }
    } catch (error) {
      console.log(error);
      setShowLoader(false);
    }
  };
  const handleNextImg = (files) => {
    setImageNextArr([...imageNextArr, ...files]);
    return;
  };
  return (
    <div className="main">
      <Container className="mt-lg-0 mt-md-0 mt-5">
        <div className="row">
          <div className="col-md-12 btn_images btn_images_collection">
            <div className="d-flex justify-content-md-end justify-content-center">
              <Button type="secondary" onClick={() => handleBack()}>
                Back
              </Button>
              <Button onClick={() => handleImageLoad()}>Next</Button>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="row mt-md-0 mt-5">
              {imageNextArr &&
                imageNextArr?.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="col-lg-4 col-md-6 col-sm-6 col-12"
                    >
                      <div className="card card_image_div">
                        <div className="card_img1">
                          <img
                            src={URL?.createObjectURL(item)}
                            alt={`${item.name}`}
                            className="rounded mx-auto d-block"
                          />
                        </div>
                        <div className="card-body">
                          <h5 className="card-title">
                            {nftName ? nftName : ""} {index + 1}
                          </h5>
                          <a className="btn btn-primary">
                            {collectionName ? collectionName : ""}
                          </a>
                        </div>
                      </div>
                    </div>
                  );
                })}
              <div key={""} className="col-lg-4 col-md-6 col-sm-6 col-12">
                <div className="card upload_image">
                  <Dropzone onDrop={(files) => handleNextImg(files)}>
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <p className="upload_card_img">
                            <UploadImageIcon />
                            <div className="d-flex justify-content-center flex-column align-items-center ">
                              <label className="browse_file">
                                Drag & drop files or <Link>Browse</Link>
                              </label>
                              <p style={{ color: "white", fontSize: "12px" }}>
                                Supported formates: JPEG, PNG
                              </p>
                            </div>
                          </p>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
      <BaseModal className="baseModal" show={showLoader}>
        <div className="loader_container">
          <h2>Please Wait...</h2>
          <LoaderIcon />
        </div>
      </BaseModal>
    </div>
  );
};
