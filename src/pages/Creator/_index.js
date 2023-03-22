const saveProfile = async () => {
    if (!firstName || !lastName || !nickName || !bio) {
      toast.error("Please input required fields");
      return;
    }
    if (!nickName.startsWith("@")) {
      toast.error('NickName must start with "@" symbol.');
      return;
    }
    try {
      setIsProcessing(true);
      const res = await firestore
        .collection("users")
        .where("nickName", "==", nickName)
        .get();
      const result = await Get_Profile(nickName);

      if (
        res.docs.length > 1 ||
        (res.docs.length === 1 && res.docs[0].id !== accounts)
      ) {
        toast.error(
          "Your nickName is already used. Please choose another one."
        );
        setIsProcessing(false);
        return;
      }
      let imgUrl, imgCoverUrl;
      var isSafari =
        /constructor/i.test(window.HTMLElement) ||
        (function (p) {
          return p.toString() === "[object SafariRemoteNotification]";
        })(
          !window["safari"] ||
            (typeof safari !== "undefined" && window["safari"].pushNotification)
        );
      if (avatar !== user.avatar && file) {
        const uploadTask = await storage
          .ref(isSafari ? `/avatars/${accounts}/` : `/avatars/${accounts}`)
          .put(file);
        if (uploadTask.state !== "success") return;
        imgUrl = await uploadTask.ref.getDownloadURL();
      }
      if (imageCover !== user.imageCover && coverFile) {
        const uploadCoverTask = await storage
          .ref(`/covers/${accounts}`)
          .put(coverFile);
        if (uploadCoverTask.state !== "success") return;
        imgCoverUrl = await uploadCoverTask.ref.getDownloadURL();
      }

      const author = {
        avatar: imgUrl || user.avatar || "/assets/img/avatars/avatar.jpg",
        imageCover: imgCoverUrl || user.imageCover || "/assets/img/bg/bg.png",
        firstName,
        lastName,
        nickName,
        account: accounts,
        bio,
        twitter: twitter || "",
        telegram: telegram || "",
        instagram: instagram || "",
        subscribe: subscribe || "",
        followers: user.followers || [],
      };
      firestore
        .collection("users")
        .doc(accounts)
        .set(author)
        .then(() => {
          toast.success("Update profile");
          dispatchProfile(author);
          setIsProcessing(false);
          setUser(author);
          resetProfile(author);
        })
        .catch((err) => {
          toast.error("Update failed.");
          setIsProcessing(false);
        });
    } catch (err) {
      toast.error("Uploading avatar failed.");
      setIsProcessing(false);
    }
  };






  const getProfile = async () => {
    const res = await firestore.collection("users").get(id);
    let userProfile = res.docs.filter((doc) => doc.id === id)[0]?.data();
    if (!userProfile)
      userProfile = {
        avatar: DefaultAvatar,
        imageCover: DefaultCoverImage,
        firstName: "",
        lastName: "",
        nickName: DefaultNickName,
        account: accounts || "",
        bio: "",
        twitter: "",
        telegram: "",
        instagram: "",
        subscribe: "",
        followers: [],
      };
    setUser(userProfile);
    resetProfile(userProfile);
  };
