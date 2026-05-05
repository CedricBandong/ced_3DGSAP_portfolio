import { socialImgs } from "../constants";

const Footer = ({ language }) => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="flex flex-col justify-center">
          <p>{
            language === 'en'
              ? "Cedric's 3D Portfolio Site"
              : "ジェリック 個人 3D ポートフォリオサイト"
          }</p>
        </div>
        <div className="socials">
          {socialImgs.map((socialImg, index) => (
            <div key={index} className="icon">
              <a href={socialImg.url} target="blank">
                <img src={socialImg.imgPath} alt="social icon" />
              </a>
            </div>
          ))}
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-center md:text-end">
            © {new Date().getFullYear()} Cedric Bandong. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
