import { useEffect } from "react";
import { config } from "config";

function generateColorStyles(colorName: string, colorValue?: string) {
  return colorValue
    ? `.text-${colorName} { color: ${colorValue}; }
       .bg-${colorName} { color: ${colorValue}; }`
    : "";
}

const InjectStyles = () => {
  useEffect(() => {
    const { styles } = config.env;
    const styleElement = document.createElement("style");

    const primaryColor = `
      ${generateColorStyles("primary-100", styles.primaryColor100)}
      ${generateColorStyles("primary-200", styles.primaryColor200)}
      ${generateColorStyles("primary-400", styles.primaryColor400)}
      ${generateColorStyles("primary-500", styles.primaryColor500)}
      ${generateColorStyles("primary-600", styles.primaryColor600)}
      ${generateColorStyles("primary-700", styles.primaryColor700)}
      ${generateColorStyles("primary-900", styles.primaryColor900)}
    `;

    const secondaryColor = `
      ${generateColorStyles("secondary-800", styles.secondaryColor800)}
      ${generateColorStyles("secondary-900", styles.secondaryColor900)}
    `;

    const customStyles = `
      ${primaryColor}
      ${secondaryColor}
      ${styles.customCSS}
    `;

    styleElement.innerHTML = customStyles;
    document.body.appendChild(styleElement);

    return () => {
      document.body.removeChild(styleElement);
    };
  }, []);

  return null;
};

export default InjectStyles;
