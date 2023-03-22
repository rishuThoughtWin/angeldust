export const LoaderIcon = (props) => {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 100 100"
      enable-background="new 0 0 100 100"
      height="100"
      width="100"
      data-testid="rotating-square-svg"
      xmlSpace="preserve"
      {...props}
    >
      <rect
        fill="none"
        stroke="#CDE438FF"
        stroke-width="4"
        x="25"
        y="25"
        width="50"
        height="50"
      >
        <animateTransform
          attributeName="transform"
          dur="0.5s"
          from="0 50 50"
          to="180 50 50"
          type="rotate"
          id="strokeBox"
          attributeType="XML"
          begin="rectBox.end"
        ></animateTransform>
      </rect>
      <rect x="27" y="27" fill="#CDE438FF" width="46" height="50">
        <animate
          attributeName="height"
          dur="1.3s"
          attributeType="XML"
          from="50"
          to="0"
          id="rectBox"
          fill="freeze"
          begin="0s;strokeBox.end"
        ></animate>
      </rect>
    </svg>
  );
};

export const ImageIcon = (props) => {
  return (
    <svg
      width="68"
      height="68"
      viewBox="0 0 68 68"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M67.3332 47.3337V7.33366C67.3332 3.66699 64.3332 0.666992 60.6665 0.666992H20.6665C16.9998 0.666992 13.9998 3.66699 13.9998 7.33366V47.3337C13.9998 51.0003 16.9998 54.0003 20.6665 54.0003H60.6665C64.3332 54.0003 67.3332 51.0003 67.3332 47.3337ZM30.6665 34.0003L37.4332 43.0337L47.3332 30.667L60.6665 47.3337H20.6665L30.6665 34.0003ZM0.666504 14.0003V60.667C0.666504 64.3337 3.6665 67.3337 7.33317 67.3337H53.9998V60.667H7.33317V14.0003H0.666504Z"
        fill="#E9B008"
      />
    </svg>
  );
};

export const DownarrowIcon = (props) => {
  return (
    <svg
      {...props}
      width="14"
      height="8"
      viewBox="0 0 14 8"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1 1L7 7L13 1"
        stroke-width="2"
        stroke="white"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export const UploadImageIcon = (props) => {
  return (
    <svg
      width="69"
      height="60"
      viewBox="0 0 69 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M36.028 14.7458L36.1203 14.7733L36.1243 14.7688C36.5619 14.8481 36.9961 14.586 37.1247 14.1519C38.2963 10.2152 41.9874 7.46504 46.0998 7.46504C46.5867 7.46504 46.9816 7.07016 46.9816 6.5833C46.9816 6.09643 46.5867 5.70156 46.0998 5.70156C41.0457 5.70156 36.7985 9.06665 35.4348 13.6493C35.2956 14.1162 35.5615 14.6067 36.028 14.7458Z"
        fill="#CDE438"
        stroke="#F9FFF9"
        stroke-width="0.3"
      />
      <path
        d="M56.3438 42.4384H51.9534C51.5494 42.4384 51.2217 42.1107 51.2217 41.7067C51.2217 41.3027 51.5494 40.9749 51.9534 40.9749H56.3438C62.3956 40.9749 67.3197 36.0509 67.3197 29.999C67.3197 23.9471 62.3956 19.023 56.3438 19.023H56.2382C56.026 19.023 55.8242 18.9311 55.6852 18.7706C55.5462 18.6101 55.4834 18.3974 55.5138 18.1873C55.5791 17.7315 55.612 17.2737 55.612 16.8279C55.612 11.5829 51.3444 7.31531 46.0995 7.31531C44.059 7.31531 42.1131 7.95296 40.4719 9.15978C40.1112 9.42478 39.599 9.30718 39.3905 8.91047C34.7425 0.0596993 22.6023 -1.12887 16.3082 6.57053C13.6568 9.81417 12.615 14.0336 13.4498 18.146C13.5418 18.6002 13.1942 19.0236 12.7327 19.0236H12.4395C6.3876 19.0236 1.46353 23.9477 1.46353 29.9996C1.46353 36.0514 6.3876 40.9755 12.4395 40.9755H16.8298C17.2338 40.9755 17.5615 41.3032 17.5615 41.7072C17.5615 42.1113 17.2338 42.439 16.8298 42.439H12.4395C5.5805 42.439 0 36.8585 0 29.9995C0 23.3329 5.27155 17.8742 11.8651 17.5731C11.2457 13.3066 12.4301 9.00295 15.1751 5.64437C21.9138 -2.5996 34.828 -1.67556 40.2871 7.51707C42.0287 6.42522 44.0215 5.85244 46.0992 5.85244C52.4538 5.85244 57.4892 11.261 57.0486 17.58C63.5813 17.9463 68.7829 23.3763 68.7829 29.999C68.7829 36.8585 63.2024 42.4384 56.3434 42.4384L56.3438 42.4384Z"
        fill="#CDE438"
      />
      <path
        d="M15.85 41.2935C15.85 51.4634 24.1237 59.737 34.2935 59.737C44.4634 59.737 52.737 51.4633 52.737 41.2935C52.737 31.1235 44.4634 22.85 34.2935 22.85C24.1235 22.85 15.85 31.1237 15.85 41.2935ZM17.6138 41.2935C17.6138 32.0966 25.0964 24.6138 34.2935 24.6138C43.4904 24.6138 50.9732 32.0964 50.9732 41.2935C50.9732 50.4904 43.4904 57.9732 34.2935 57.9732C25.0966 57.9732 17.6138 50.4905 17.6138 41.2935Z"
        fill="#CDE438"
        stroke="#F9FFF9"
        stroke-width="0.3"
      />
      <path
        d="M33.9423 48.6577C33.9423 49.0363 34.2494 49.3434 34.628 49.3434C35.0066 49.3434 35.3137 49.0367 35.3137 48.6577V34.7291C35.3137 34.3504 35.0066 34.0434 34.628 34.0434C34.2494 34.0434 33.9423 34.3504 33.9423 34.7291V48.6577Z"
        fill="#CDE438"
        stroke="#483EA8"
        stroke-width="0.3"
      />
      <path
        d="M34.6281 35.6999L30.8274 39.5006L34.6281 35.6999ZM34.6281 35.6999L38.4289 39.5007C38.5626 39.6344 38.7386 39.7015 38.9138 39.7015C39.0886 39.7015 39.2647 39.635 39.3987 39.5006C39.6665 39.2327 39.6665 38.7988 39.3986 38.5309L35.113 34.2452C34.8452 33.9775 34.4108 33.9773 34.1432 34.2452C34.1432 34.2453 34.1431 34.2453 34.1431 34.2453L29.8576 38.5309C29.5897 38.7988 29.5897 39.2328 29.8576 39.5007C30.1254 39.7685 30.5597 39.7686 30.8273 39.5007L34.6281 35.6999Z"
        fill="#CDE438"
        stroke="#483EA8"
        stroke-width="0.3"
      />
    </svg>
  );
};
