import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import Tesseract from "tesseract.js";

const Camera: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [text, setText] = useState<string>("");

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const capturedImage = webcamRef.current.getScreenshot();
      if (capturedImage) {
        setImageSrc(capturedImage);
        processImage(capturedImage);
      }
    }
  }, [webcamRef]);

  const processImage = async (image: string) => {
    setText("Processando imagem...");
    try {
      const { data } = await Tesseract.recognize(image, "por"); // "por" para português
      setText(data.text);
    } catch (error) {
      setText("Erro ao processar a imagem.");
      console.error("Erro no OCR:", error);
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/png"
        width="100%"
        style={{ borderRadius: "10px" }}
      />
      <button onClick={capture} style={{ marginTop: "10px", padding: "10px", fontSize: "16px" }}>
        Capturar e Ler Texto
      </button>

      {imageSrc && (
        <div>
          <h3>Imagem Capturada:</h3>
          <img src={imageSrc} alt="Captura" style={{ width: "50%", borderRadius: "10px" }} />
        </div>
      )}

      {text && (
        <div>
          <h3>Texto Reconhecido:</h3>
          <p>{text}</p>
        </div>
      )}
    </div>
  );
};

export default Camera;
