"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Container,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  Badge,
  HStack,
  VStack,
  Spinner,
  Flex,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Icon,
} from "@chakra-ui/react";
import { TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { getActivity } from "../../../services/api";
import {
  FaArrowLeft,
  FaRunning,
  FaHeartbeat,
  FaFire,
  FaMountain,
} from "react-icons/fa";

const COLORS = [
  "#7fcd91",
  "#a5d86e",
  "#d0e15b",
  "#f7dc56",
  "#f3a73c",
  "#e05d5d",
];

export default function Activity() {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log("Activity", activity);
  const { id } = useParams();

  useEffect(() => {
    getActivity(id)
      .then((data) => {
        setActivity(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch activity:", error);
        setLoading(false);
      });
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (duration) => {
    if (!duration) return "00:00:00";
    const [hours, minutes, seconds] = duration.split(":").map(Number);
    return `${hours}h ${minutes}m ${Math.round(seconds)}s`;
  };

  const calculateHRZones = (activity) => {
    if (!activity) return [];

    const timeToSeconds = (time) => {
      if (!time) return 0;
      const [h, m, s] = (time.split(".")[0] || "0:0:0").split(":").map(Number);
      return h * 3600 + m * 60 + s;
    };

    if (!activity.hrz_1_time) return [];

    const totalSeconds = timeToSeconds(activity.moving_time);

    return [1, 2, 3, 4, 5].map((zone) => {
      const zoneSeconds = timeToSeconds(activity[`hrz_${zone}_time`]);
      return {
        zone: `Zone ${zone}`,
        time: activity[`hrz_${zone}_time`] || "0:00:00",
        seconds: zoneSeconds,
        percent: totalSeconds
          ? parseFloat(((zoneSeconds / totalSeconds) * 100).toFixed(1))
          : 0,
      };
    });
  };
  const hrzTimes = calculateHRZones(activity);

  const chartConfig = {
    width: 400,
    height: 400,
    margin: { top: 20, right: 20, bottom: 20, left: 20 },
    xKey: "zone",
    yKey: "percent",
    data: hrzTimes,
    // Add color configuration for each zone
    "Zone 1": {
      label: "Zone 1",
      color: "#0088FE", // Blue
    },
    "Zone 2": {
      label: "Zone 2",
      color: "#00C49F", // Green
    },
    "Zone 3": {
      label: "Zone 3",
      color: "#FFBB28", // Yellow
    },
    "Zone 4": {
      label: "Zone 4",
      color: "#FF8042", // Orange
    },
    "Zone 5": {
      label: "Zone 5",
      color: "#8884d8", // Purple
    },
    percent: {
      label: "Percentage",
    },
  };

  if (loading) {
    return (
      <Flex height="70vh" align="center" justify="center">
        <Spinner size="xl" thickness="4px" speed="0.65s" color="blue.500" />
      </Flex>
    );
  }

  if (!activity) {
    return (
      <Container maxW="container.lg" py={8}>
        <Button
          as={Link}
          href="/activities"
          leftIcon={<FaArrowLeft />}
          colorScheme="blue"
          variant="filled"
          mb={6}
        >
          Back to Activities
        </Button>
        <Heading>Activity not found</Heading>
        <Text mt={4}>The activity you're looking for couldn't be loaded.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={6}>
      <Button
        as={Link}
        href="/activities"
        leftIcon={<FaArrowLeft />}
        colorScheme="blue"
        variant="filled"
        mb={6}
      >
        Back to Activities
      </Button>

      {/* Activity Header */}
      <Box bg="gray.700" p={6} borderRadius="lg" mb={6} boxShadow="md">
        <Flex justify="space-between" wrap="wrap">
          <Box>
            <Heading as="h1" size="lg">
              {activity.name || "Unnamed Activity"}
            </Heading>
            <HStack mt={2}>
              {activity.sport && (
                <Badge colorScheme="green" px={2} py={1} borderRadius="full">
                  {activity.sport}
                </Badge>
              )}
            </HStack>
          </Box>
          <Box p={3} borderRadius="md" fontSize="sm" textAlign="center">
            <Text fontWeight="bold">{formatDate(activity.start_time)}</Text>
            <Text>
              {formatTime(activity.start_time)} -{" "}
              {formatTime(activity.stop_time)}
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Main Stats Cards */}
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
        <Card boxShadow="md" borderRadius="lg" overflow="hidden">
          <CardHeader color="white" py={3}>
            <Heading size="md">Activity Stats</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} p={2}>
              <Stat>
                <Flex align="center">
                  <Icon as={FaRunning} mr={2} color="blue.500" />
                  <StatLabel>Distance</StatLabel>
                </Flex>
                <StatNumber>{activity.distance?.toFixed(2) || 0} km</StatNumber>
                <StatHelpText>
                  <Icon as={FaMountain} mr={1} />{" "}
                  {activity.ascent?.toFixed(0) || 0} m elevation
                </StatHelpText>
              </Stat>

              <Stat>
                <Flex align="center">
                  <Icon as={FaFire} mr={2} color="orange.500" />
                  <StatLabel>Calories</StatLabel>
                </Flex>
                <StatNumber>{activity.calories || 0}</StatNumber>
                <StatHelpText>burned</StatHelpText>
              </Stat>

              <Stat>
                <StatLabel>Moving Time</StatLabel>
                <StatNumber>
                  {formatDuration(activity.moving_time) || "00:00:00"}
                </StatNumber>
                <StatHelpText>
                  Elapsed: {formatDuration(activity.elapsed_time) || "00:00:00"}
                </StatHelpText>
              </Stat>

              <Stat>
                <StatLabel>Avg Speed</StatLabel>
                <StatNumber>
                  {activity.avg_speed?.toFixed(2) || 0} km/h
                </StatNumber>
                <StatHelpText>
                  Max: {activity.max_speed?.toFixed(2) || 0} km/h
                </StatHelpText>
              </Stat>
            </SimpleGrid>
          </CardBody>
        </Card>

        <Card boxShadow="md" borderRadius="lg" overflow="hidden">
          <CardHeader color="white" py={3}>
            <Heading size="md">Heart Rate & Cadence</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4} p={2}>
              <Stat>
                <Flex align="center">
                  <Icon as={FaHeartbeat} mr={2} color="red.500" />
                  <StatLabel>Avg Heart Rate</StatLabel>
                </Flex>
                <StatNumber>{activity.avg_hr || 0} bpm</StatNumber>
                <StatHelpText>Max: {activity.max_hr || 0} bpm</StatHelpText>
              </Stat>

              <Stat>
                <StatLabel>Avg Cadence</StatLabel>
                <StatNumber>{activity.avg_cadence?.toFixed(0) || 0}</StatNumber>
                <StatHelpText>steps/min</StatHelpText>
              </Stat>

              <Stat>
                <StatLabel>HR Zones</StatLabel>
                <HStack spacing={1} mt={2}>
                  {[1, 2, 3, 4, 5].map((zone) => (
                    <Box
                      key={zone}
                      h="20px"
                      w="full"
                      bg={COLORS[zone - 1]}
                      borderRadius="sm"
                    />
                  ))}
                </HStack>
                <StatHelpText>Z1 - Z5</StatHelpText>
              </Stat>

              <Stat>
                <StatLabel>Max Cadence</StatLabel>
                <StatNumber>{activity.max_cadence?.toFixed(0) || 0}</StatNumber>
                <StatHelpText>steps/min</StatHelpText>
              </Stat>
            </SimpleGrid>
          </CardBody>
        </Card>
      </SimpleGrid>

      {activity.hrz_1_time && (
        <Card mb={6} boxShadow="md" borderRadius="lg" overflow="hidden">
          <CardHeader color="white">
            <Heading size="md">Heart Rate Zones</Heading>
          </CardHeader>
          <CardBody>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <Box height="300px">
                <ChartContainer config={chartConfig}>
                  <PieChart>
                    <Pie
                      data={hrzTimes}
                      dataKey="percent"
                      nameKey="zone"
                      innerRadius={50}
                    >
                      {hrzTimes.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </Box>
              <VStack align="stretch" spacing={2}>
                {hrzTimes.map((zoneData, index) => (
                  <Flex
                    key={zoneData.zone}
                    justify="space-between"
                    p={3}
                    bg={COLORS[index % COLORS.length]}
                    borderRadius="md"
                  >
                    <Text fontWeight="bold" color="gray.700">
                      {zoneData.zone}
                    </Text>
                    <HStack spacing={2}>
                      <Text fontWeight="bold" color="gray.700">
                        {zoneData.percent}%
                      </Text>
                    </HStack>
                  </Flex>
                ))}
              </VStack>
            </SimpleGrid>
          </CardBody>
        </Card>
      )}
    </Container>
  );
}
