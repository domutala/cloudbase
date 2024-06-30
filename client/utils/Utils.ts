export default {
  sleep(time = 500) {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(true), time);
    });
  },

  share(text: string, title?: string, mimetype?: string) {
    // const share = navigator.share as (
    //   text: string,
    //   title?: string,
    //   mimetype?: string
    // ) => void;
    // share(text, title, mimetype);
  },

  Number: {
    format: {
      time(seconds: number) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${
          remainingSeconds < 10 ? "0" : ""
        }${remainingSeconds}`;
      },

      duration(duration: number) {
        const hours = Math.floor(duration / 3600);
        const remainingSeconds = duration % 3600;
        const minutes = Math.floor(remainingSeconds / 60);

        if (hours < 1) {
          if (minutes < 1) return `${duration} sec`;
          return `${minutes} min`;
        }
        return `${hours} h ${minutes} min`;
      },

      distance(distance: number) {
        let distanceFormatee: string;

        if (distance >= 1000) {
          const distanceEnKilometres = distance / 1000;
          distanceFormatee = distanceEnKilometres.toFixed(2) + " km";
        } else {
          distanceFormatee = distance.toFixed(0) + " m";
        }

        return distanceFormatee;
      },
    },
  },

  Toast: {
    push(message: any) {
      message.key = Math.random().toString();
      dispatchEvent(new CustomEvent("toast:push", { detail: message }));
    },
  },
};
