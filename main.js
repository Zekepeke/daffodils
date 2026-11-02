/*credits for flower:https://github.com/naveen-kumawat/Flower*/


onload = () => {
    const c = setTimeout(() => {
      document.body.classList.remove("not-loaded");
      clearTimeout(c);
    }, 1000);
  };