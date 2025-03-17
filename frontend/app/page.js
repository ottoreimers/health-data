"use client";
import Image from "next/image";
import { Heading, Container, Button } from "@chakra-ui/react";
import Link from "next/link";
import Activity from "./activities/page.js";

import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <Container maxW="xxl">
        <Heading as="h1" size="2xl">
          Dashboard
        </Heading>
        <Activity />
      </Container>
    </div>
  );
}
