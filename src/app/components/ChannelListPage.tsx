"use client";
import "@sendbird/uikit-react/dist/index.css";

import { useState } from "react";
import toast from "react-hot-toast";

import GroupChannelList from "@sendbird/uikit-react/GroupChannelList";
import GroupChannelListHeader from "@sendbird/uikit-react/GroupChannelList/components/GroupChannelListHeader";
import { GroupChannelProvider } from "@sendbird/uikit-react/GroupChannel/context";
import GroupChannelUI from "@sendbird/uikit-react/GroupChannel/components/GroupChannelUI";

import CreateChannel from "@sendbird/uikit-react/CreateChannel";
import Icon from "@sendbird/uikit-react/ui/Icon";
import { IconTypes, IconColors } from "@sendbird/uikit-react/ui/Icon";
import Header from "@sendbird/uikit-react/ui/Header";

import EditUserProfile from "@sendbird/uikit-react/EditUserProfile";
import CustomMessageInput from "./CustomMessageInput";

const ChannelListPage = () => {
  const [showCreateChannel, setShowCreateChannel] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [selectedChannelUrl, setSelectedChannelUrl] = useState<string | null>(
    null
  );
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "320px", borderRight: "1px solid #ddd" }}>
        <GroupChannelList
          onChannelCreated={(channel) => {
            console.log("channel created:", channel);
          }}
          onChannelSelect={(channel) => {
            if (!channel) return;
            setSelectedChannelUrl(channel.url);
          }}
          renderHeader={() => (
            <GroupChannelListHeader
              allowProfileEdit={true}
              onEdit={() => setShowEditProfile(true)}
              renderRight={() => (
                <Header.IconButton
                  type="CREATE"
                  color="PRIMARY"
                  renderIcon={(props) => (
                    <Icon
                      {...props}
                      type={IconTypes.CREATE}
                      fillColor={IconColors.PRIMARY}
                      width="24px"
                      height="24px"
                      onClick={() => setShowCreateChannel(true)}
                    />
                  )}
                />
              )}
            />
          )}
        />
      </div>

      <div style={{ flex: 1 }}>
        {selectedChannelUrl ? (
          <GroupChannelProvider channelUrl={selectedChannelUrl}>
            <GroupChannelUI renderMessageInput={() => <CustomMessageInput />} />
          </GroupChannelProvider>
        ) : (
          <div style={{ padding: "24px", color: "#999" }}>
            Select a channel to start chatting
          </div>
        )}
      </div>

      {showCreateChannel && (
        <CreateChannel
          onCancel={() => setShowCreateChannel(false)}
          onChannelCreated={async (channel) => {
            // Save to database if only a 1 - 1
            if (channel.memberCount !== 2) return;

            const chatmateUserId = channel.members.find(
              (member) => member.userId !== channel.creator?.userId
            )?.userId;

            const params = {
              channelUrl: channel.url,
              chatmateId: chatmateUserId,
              totalMessages: 0,
              isDeleted: false,
              createdBy: channel.creator?.userId,
            };

            const response = await fetch("/api/channel/create-channel", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(params),
            });

            if (!response.ok) {
              toast.error("Failed to create channel");
              return;
            } else {
              toast.success("Channel created");
              setShowCreateChannel(false);
            }

            setSelectedChannelUrl(channel.url);
            setShowCreateChannel(false);
          }}
        />
      )}

      {showEditProfile && (
        <EditUserProfile
          onCancel={() => setShowEditProfile(false)}
          onEditProfile={async (res) => {
            const params = {
              userId: res.userId,
              nickname: res.nickname,
              profileUrl: res.profileUrl,
            };
            const response = await fetch("/api/user/update-user", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(params),
            });
            if (!response.ok) {
              toast.error("Failed to update user");
              return;
            } else {
              toast.success("Profile updated successfully!");
              setShowEditProfile(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default ChannelListPage;
