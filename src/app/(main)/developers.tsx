import React from "react";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  View,
  Alert,
  StatusBar,
} from "react-native";
import { Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const teamPhoto = require("../../../assets/images/developers-pic.jpeg");

// Temporary portraits. Replace with individual photos when available.
const satinderPhoto = require("../../../assets/images/developers-pic.jpeg");
const vaibhavPhoto = require("../../../assets/images/developers-pic.jpeg");

const COLORS = {
  primary: "#315C4A",
  primaryDark: "#244738",
  accent: "#79A98B",
  background: "#F5F8F5",
  surface: "#FFFFFF",
  heading: "#182820",
  body: "#617168",
  muted: "#89968E",
  border: "#E2EAE4",
  softGreen: "#EDF5EF",
};

type DeveloperLink = {
  label: string;
  url: string;
  icon: React.ComponentProps<typeof Ionicons>["name"];
};

const openLink = async (url: string) => {
  try {
    await Linking.openURL(url);
  } catch {
    Alert.alert("Unable to open link", "Please try again later.");
  }
};

function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <View className="mb-3">
      <Text className="text-[10px] font-bold uppercase tracking-[2px] text-[#73917D]">
        {eyebrow}
      </Text>
      <Text className="mt-1 text-lg font-bold text-[#182820]">{title}</Text>
    </View>
  );
}

function SkillChip({ label }: { label: string }) {
  return (
    <View className="mb-2 mr-2 rounded-full border border-[#DFEAE1] bg-[#F4F8F4] px-3 py-[7px]">
      <Text className="text-[11px] font-semibold text-[#426951]">{label}</Text>
    </View>
  );
}

function DeveloperCard({
  name,
  role,
  photo,
  description,
  skills,
  links,
  index,
}: {
  name: string;
  role: string;
  photo: number;
  description: string;
  skills: string[];
  links: DeveloperLink[];
  index: string;
}) {
  return (
    <View className="mb-5 overflow-hidden rounded-[24px] border border-[#E2EAE4] bg-white">
      {/* Profile header */}
      <View className="bg-[#EDF4EE] px-5 pb-5 pt-5">
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="h-7 w-7 items-center justify-center rounded-lg bg-white">
              <Ionicons
                name="person-outline"
                size={15}
                color={COLORS.primary}
              />
            </View>
            <Text className="ml-2 text-[10px] font-bold uppercase tracking-[1.6px] text-[#587663]">
              Developer profile
            </Text>
          </View>

          <Text className="text-xs font-bold tracking-[2px] text-[#A0B6A5]">
            {index}
          </Text>
        </View>

        <View className="flex-row items-center">
          <View className="rounded-full border-[3px] border-white">
            <Image
              source={photo}
              className="h-[94px] w-[94px] rounded-full"
              resizeMode="cover"
              accessibilityLabel={`${name} profile photo`}
            />
          </View>

          <View className="ml-4 flex-1">
            <Text className="text-[19px] font-bold leading-6 text-[#182820]">
              {name}
            </Text>

            <Text className="mt-1 text-xs font-semibold leading-5 text-[#47715B]">
              {role}
            </Text>

            <View className="mt-3 self-start flex-row items-center rounded-full border border-[#DDE8DE] bg-white px-2.5 py-1.5">
              <Ionicons
                name="school-outline"
                size={13}
                color={COLORS.primary}
              />
              <Text className="ml-1.5 text-[10px] font-semibold text-[#52685A]">
                MCA · KIIT University
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Profile details */}
      <View className="p-5">
        <View className="mb-5">
          <View className="mb-2 flex-row items-center">
            <View className="mr-2 h-5 w-1 rounded-full bg-[#79A98B]" />
            <Text className="text-sm font-bold text-[#263B30]">About</Text>
          </View>

          <Text className="text-[13px] leading-[22px] text-[#617168]">
            {description}
          </Text>
        </View>

        <View className="mb-5">
          <View className="mb-2 flex-row items-center">
            <View className="mr-2 h-5 w-1 rounded-full bg-[#79A98B]" />
            <Text className="text-sm font-bold text-[#263B30]">
              Skills & interests
            </Text>
          </View>

          <View className="flex-row flex-wrap">
            {skills.map((skill) => (
              <SkillChip key={skill} label={skill} />
            ))}
          </View>
        </View>

        {links.length > 0 && (
          <View>
            <View className="mb-3 flex-row items-center">
              <View className="mr-2 h-5 w-1 rounded-full bg-[#79A98B]" />
              <Text className="text-sm font-bold text-[#263B30]">Connect</Text>
            </View>

            {links.map((link) => (
              <Pressable
                key={link.url}
                onPress={() => openLink(link.url)}
                accessibilityRole="link"
                accessibilityLabel={link.label}
                className="mb-2 min-h-[48px] flex-row items-center rounded-xl border border-[#E1EAE2] bg-[#FBFCFB] px-3 active:bg-[#EDF5EF]"
              >
                <View className="h-9 w-9 items-center justify-center rounded-lg bg-[#EDF5EF]">
                  <Ionicons name={link.icon} size={18} color={COLORS.primary} />
                </View>

                <Text className="ml-3 flex-1 text-[12px] font-bold text-[#315C4A]">
                  {link.label}
                </Text>

                <Ionicons name="open-outline" size={17} color="#789183" />
              </Pressable>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

export default function DevelopersScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          title: "Meet the Developers",
          headerShown: false,
        }}
      />

      <SafeAreaView className="flex-1 bg-[#F5F8F5]" edges={["top"]}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        {/* Navigation header */}
        <View className="flex-row items-center border-b border-[#E7ECE8] bg-white px-5 py-3">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full border border-[#E4EBE5] bg-[#F7FAF7] active:bg-[#EAF2EC]"
          >
            <Ionicons name="arrow-back" size={20} color={COLORS.primary} />
          </Pressable>

          <View className="ml-3 flex-1">
            <Text className="text-[15px] font-bold text-[#182820]">
              Meet the Developers
            </Text>
            <Text className="mt-0.5 text-[10px] text-[#849188]">
              The team behind Niramaya
            </Text>
          </View>

          <View className="h-9 w-9 items-center justify-center rounded-full bg-[#EDF5EF]">
            <Ionicons name="leaf-outline" size={18} color={COLORS.primary} />
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 18,
            paddingTop: 20,
            paddingBottom: 36,
          }}
        >
          {/* Hero */}
          <View className="mb-7 overflow-hidden rounded-[24px] border border-[#DCE8DE] bg-white">
            <Image
              source={teamPhoto}
              className="h-[205px] w-full"
              resizeMode="cover"
              accessibilityLabel="Niramaya development team"
            />

            <View className="p-5">
              <View className="self-start flex-row items-center rounded-full bg-[#EDF5EF] px-3 py-1.5">
                <View className="mr-2 h-1.5 w-1.5 rounded-full bg-[#5D9870]" />
                <Text className="text-[9px] font-bold uppercase tracking-[1.5px] text-[#426951]">
                  The people behind Niramaya
                </Text>
              </View>

              <Text className="mt-3 text-[27px] font-bold leading-[34px] tracking-[-0.7px] text-[#182820]">
                Meet the{"\n"}developers.
              </Text>

              <Text className="mt-2 text-[13px] leading-[22px] text-[#617168]">
                A shared interest in technology and wellbeing, brought together
                to build a more accessible wellness experience.
              </Text>

              <View className="mt-4 h-[1px] bg-[#E9EFEA]" />

              <View className="mt-4 flex-row items-center">
                <View className="mr-2 flex-row">
                  <View className="h-2 w-2 rounded-full bg-[#315C4A]" />
                  <View className="-ml-0.5 h-2 w-2 rounded-full border border-white bg-[#79A98B]" />
                </View>

                <Text className="text-[11px] font-semibold text-[#6A7A70]">
                  Two developers · One shared vision
                </Text>
              </View>
            </View>
          </View>

          {/* Developer section */}
          <View className="mb-4">
            <SectionHeading
              eyebrow="Meet the team"
              title="The people & their craft"
            />
            <Text className="mb-5 text-[12px] leading-5 text-[#718077]">
              Get to know the developers, their interests, and the work they
              bring to the project.
            </Text>
          </View>

          <DeveloperCard
            index="01"
            name="Satinder Singh Sall"
            role="Full-Stack Developer"
            photo={satinderPhoto}
            description="MCA student at KIIT University interested in building modern web and mobile applications. Focuses on frontend experiences, backend APIs, databases, application architecture, and deployment, while also exploring AI, machine learning, computer vision, and automation through practical projects."
            skills={[
              "React",
              "Next.js",
              "React Native",
              "Expo",
              "TypeScript",
              "Node.js",
              "Express",
              "MongoDB",
              "MySQL",
              "AI / ML",
              "Computer Vision",
              "Cloud Deployment",
            ]}
            links={[
              {
                label: "GitHub",
                url: "https://github.com/SatinderSinghSall",
                icon: "logo-github",
              },
              {
                label: "Portfolio website",
                url: "https://satinder-portfolio.vercel.app/",
                icon: "globe-outline",
              },
              {
                label: "LinkedIn profile",
                url: "https://www.linkedin.com/in/satinder-singh-sall-b62049204/",
                icon: "logo-linkedin",
              },
            ]}
          />

          <DeveloperCard
            index="02"
            name="Soni Vaibhav Kumar"
            role="AI / ML Enthusiast"
            photo={vaibhavPhoto}
            description="MCA student at KIIT University with an interest in artificial intelligence and machine learning. Interested in exploring intelligent software solutions, learning data-driven approaches, and applying emerging technologies to practical problems as part of the Niramaya team."
            skills={[
              "Artificial Intelligence",
              "Machine Learning",
              "Data-Driven Solutions",
              "Problem Solving",
              "Software Development",
            ]}
            links={[
              {
                label: "GitHub repositories",
                url: "https://github.com/SoniVaibhavKumar?tab=repositories",
                icon: "logo-github",
              },
            ]}
          />

          {/* Closing note */}
          <View className="items-center rounded-[22px] border border-[#DFE9E1] bg-[#EDF5EF] px-6 py-6">
            <View className="h-12 w-12 items-center justify-center rounded-2xl border border-white bg-white">
              <Ionicons name="leaf" size={23} color={COLORS.primary} />
            </View>

            <Text className="mt-3 text-center text-base font-bold text-[#263B30]">
              Built with care for wellbeing
            </Text>

            <Text className="mt-2 text-center text-[12px] leading-5 text-[#617168]">
              Thank you for exploring the people and work behind Niramaya.
            </Text>

            <Text className="mt-4 text-[9px] font-semibold uppercase tracking-[2px] text-[#82988A]">
              Niramaya · Wellness, thoughtfully designed
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
