// src/progressBar.js
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import "../index.css";


NProgress.configure({
  showSpinner: false,
  trickleSpeed: 200,
  easing: "ease",
  speed: 500,
});

export default NProgress;
