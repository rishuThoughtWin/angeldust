import { UploadImageIcon } from "components/Icons";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import "./style.css";

const thumbsContainer = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
};

const thumb = {
  display: "inline-flex",
  borderRadius: 2,
  border: "1px solid #eaeaea",
  height: 100,
  width: 100,
  padding: 4,
  boxSizing: "border-box",
};

const thumbInner = {
  display: "flex",
  minWidth: 0,
  overflow: "hidden",
  width: "100%",
};

const img = {
  display: "block",
  width: "100%",
  height: "100%",
};

const acceptedList = {
  Audio: "audio/*",
  All: "image/*, video/*",
};

export default function NFTDropzone(props) {
  const [previewFile, setpreviewFile] = useState({ preview: props?.image });

  const { getRootProps, getInputProps } = useDropzone({
    accept:
      props.nftType === "Audio"
        ? acceptedList["Audio"]
        : props.nftType === "image"
        ? "image/*"
        : props.nftType === "Video"
        ? "video/*"
        : acceptedList["All"],
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      props.onChange(file);
      if (file) {
        if (file.size > 1e8) {
          toast.error("File Size Should be less than 100MB");
        } else {
          if (file.type.startsWith("audio")) {
            file.preview = "assets/icon/audio.png";
            setpreviewFile(file);
          } else if (file.type.startsWith("video")) {
            file.preview = "assets/icon/video.png";
            setpreviewFile(file);
          } else if (file.type.startsWith("image")) {
            file.preview = URL.createObjectURL(file);
            setpreviewFile(file);
          } else {
            file.preview = "assets/icon/file.png";
            setpreviewFile(file);
          }
        }
      }
    },
  });

  useEffect(() => {
    if (props?.isClearPreview) {
      setpreviewFile("");
    }
  }, [props?.isClearPreview]);

  props.setColPreview &&
    previewFile.preview &&
    props.setColPreview(previewFile);

  return (
    <>
      <section className="container flex pt-2 pb-2 pl-0 pr-0">
        <div
          {...getRootProps({ className: "dropzone" })}
          className="flex flex-wrap items-center justify-center focus:outline-none mx-auto drop-card"
        >
          <div className="flex flex-column items-center gap-2">
            <input
              {...getInputProps()}
              style={{ opacity: 0, display: "none" }}
            />
            <UploadImageIcon height={40} />
            <div className="slim text-set mt-3">
              Drag & drop files or <span class="browseLink"> Browse </span>{" "}
            </div>
          </div>
        </div>
        <aside style={thumbsContainer} className="space-x-5 upload-imgeprev">
          {previewFile.preview && (
            <div style={thumb}>
              <div style={thumbInner}>
                <img src={previewFile.preview} alt="preview" style={img} />
              </div>
            </div>
          )}
        </aside>
      </section>
    </>
  );
}
