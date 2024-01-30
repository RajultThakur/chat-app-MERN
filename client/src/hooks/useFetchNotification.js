import { useState, useEffect } from "react";

export const useFetchNotification = (notifications, chatId = "") => {
  const [myNotifications, setMyNotification] = useState(null);
  //   const [particularNotification, setParticularNotification] = useState(null);

  useEffect(() => {
    if (!notifications) return;
    const userNotification = notifications.find(
      (notification) => notification.chatId === chatId,
    );
    // if(chatId){
    //     const particularNotif = userNotification.find(notification => notification.chatId === chatId)
    //     if(particularNotif){
    //         setParticularNotification(particularNotif);
    //     }
    //     // console.log(particularNotification);
    // }
    // console.log(userNotification,"notifications")

    // if (!userNotification) return null;
    setMyNotification(userNotification);
  }, [notifications]);

  return { myNotifications };
};
