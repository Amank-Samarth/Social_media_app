import {
  EditOutlined,
  DeleteOutlined,
  AttachFileOutlined,
  GifBoxOutlined,
  ImageOutlined,
  MicOutlined,
  MoreHorizOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  Typography,
  InputBase,
  useTheme,
  Button,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Dropzone from "react-dropzone";
import UserImage from "components/UserImage";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";

const MyPostWidget = ({ picturePath }) => {
  const dispatch = useDispatch();
  const [isImage, setIsImage] = useState(false);
  const [isClip, setIsClip] = useState(false);
  const [isAttachment, setIsAttachment] = useState(false);
  const [isAudio, setIsAudio] = useState(false);
  const [image, setImage] = useState(null);
  const [clip, setClip] = useState(null);
  const [attachment, setAttachment] = useState(null);
  const [audio, setAudio] = useState(null);
  const [post, setPost] = useState("");
  const { palette } = useTheme();
  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  // Replace deprecated neutral palette usage with new professional palette
  const mediumMain = palette.secondary.main;
  const medium = palette.secondary.light;
  const light = palette.secondary.light;

  const handlePost = async () => {
    const formData = new FormData();
    formData.append("userId", _id);
    formData.append("description", post);
    if (image) {
      formData.append("picture", image);
      formData.append("picturePath", image.name);
    }
    if (clip) {
      formData.append("clip", clip);
      formData.append("clipPath", clip.name);
    }
    if (attachment) {
      formData.append("attachment", attachment);
      formData.append("attachmentPath", attachment.name);
    }
    if (audio) {
      formData.append("audio", audio);
      formData.append("audioPath", audio.name);
    }

    const response = await fetch(`http://localhost:3001/posts`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const posts = await response.json();
    dispatch(setPosts({ posts }));
    setImage(null);
    setClip(null);
    setAttachment(null);
    setAudio(null);
    setPost("");
  };

  const handleFileDrop = (acceptedFiles, setFile, allowedFormats) => {
    const file = acceptedFiles[0];
    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (allowedFormats.includes(fileExtension)) {
        setFile(file);
      } else {
        window.alert(`Invalid file format. Allowed formats: ${allowedFormats.join(", ")}`);
      }
    }
  };

  const renderDropzone = (setFile, allowedFormats, fileType, label) => (
    <Box border={`1px solid ${medium}`} borderRadius="5px" mt="1rem" p="1rem">
      <Dropzone
        multiple={false}
        onDrop={(acceptedFiles) => handleFileDrop(acceptedFiles, setFile, allowedFormats)}
      >
        {({ getRootProps, getInputProps }) => (
          <FlexBetween>
            <Box
              {...getRootProps()}
              border={`2px dashed ${palette.primary.main}`}
              p="1rem"
              width="100%"
              sx={{ "&:hover": { cursor: "pointer" } }}
            >
              <input {...getInputProps()} />
              {!fileType ? (
                <p>{`Add ${label} Here (${allowedFormats.join(", ")})`}</p>
              ) : (
                <FlexBetween>
                  <Typography>{fileType.name}</Typography>
                  <EditOutlined />
                </FlexBetween>
              )}
            </Box>
            {fileType && (
              <IconButton
                onClick={() => setFile(null)}
                sx={{ width: "15%" }}
              >
                <DeleteOutlined />
              </IconButton>
            )}
          </FlexBetween>
        )}
      </Dropzone>
    </Box>
  );

  return (
    <WidgetWrapper>
      <FlexBetween gap="1.5rem">
        <UserImage image={picturePath} />
        <InputBase
          placeholder="What's on your mind..."
          onChange={(e) => setPost(e.target.value)}
          value={post}
          sx={{
            width: "100%",
            backgroundColor: light,
            borderRadius: "2rem",
            padding: "1rem 2rem",
            color: palette.mode === 'dark' ? palette.grey[800] : palette.text.primary,
          }}
        />
        <IconButton>
          <MoreHorizOutlined sx={{ color: mediumMain }} />
        </IconButton>
      </FlexBetween>

      {isImage && renderDropzone(setImage, ["jpg", "jpeg", "png"], image, "Image")}
      {isClip && renderDropzone(setClip, ["gif"], clip, "GIF Clip")}
      {isAttachment && renderDropzone(setAttachment, ["pdf", "doc", "docx"], attachment, "Attachment")}
      {isAudio && renderDropzone(setAudio, ["mp3", "wav"], audio, "Audio")}

      <Divider sx={{ margin: "1.25rem 0" }} />

      <FlexBetween>
        {isNonMobileScreens && (
          <Typography color={mediumMain}>
            🖥️
          </Typography>
        )}

        <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
          <ImageOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Image
          </Typography>
        </FlexBetween>

        <FlexBetween gap="0.25rem" onClick={() => setIsClip(!isClip)}>
          <GifBoxOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Clip
          </Typography>
        </FlexBetween>

        <FlexBetween gap="0.25rem" onClick={() => setIsAttachment(!isAttachment)}>
          <AttachFileOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Attachment
          </Typography>
        </FlexBetween>

        <FlexBetween gap="0.25rem" onClick={() => setIsAudio(!isAudio)}>
          <MicOutlined sx={{ color: mediumMain }} />
          <Typography
            color={mediumMain}
            sx={{ "&:hover": { cursor: "pointer", color: medium } }}
          >
            Audio
          </Typography>
        </FlexBetween>

        <Button
          disabled={!post}
          onClick={handlePost}
          sx={{
            color: palette.background.alt,
            backgroundColor: palette.primary.main,
            borderRadius: "3rem",
          }}
        >
          POST
        </Button>
      </FlexBetween>
    </WidgetWrapper>
  );
};

export default MyPostWidget;
