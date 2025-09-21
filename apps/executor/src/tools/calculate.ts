import z from "zod";
import { tool } from "@langchain/core/tools";

function calculateSum(a: number, b: number): number {
  return a + b;
}

function calculateProduct(a: number, b: number): number {
  return a * b;
}

function calculatePower(base: number, exponent: number): number {
  return Math.pow(base, exponent);
}

function calculateDivision(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division by zero is not allowed");
  }
  return a / b;
}

export const tools = [
  tool(
    async (input: any) => {
      const { a, b } = input;
      const result = calculateSum(a, b);
      console.log(`Sum calculation: ${a} + ${b} = ${result}`);
      return `The sum of ${a} and ${b} is ${result}`;
    },
    {
      name: "sum",
      description: "Calculate the sum of two number",
      schema: z.object({
        a: z.number().describe("First number"),
        b: z.number().describe("Second number"),
      }),
    }
  ),

  tool(
    async (input: any) => {
      const { a, b } = input;
      const result = calculateProduct(a, b);
      console.log(`Multiply calculation: ${a} x ${b} = ${result}`);
      return `The product of ${a} and ${b} is ${result}`;
    },
    {
      name: "multiply",
      description: "Multiply two numbers",
      schema: z.object({
        a: z.number().describe("First number"),
        b: z.number().describe("Second number"),
      }),
    }
  ),

  tool(
    async (input: any) => {
      const { a, b } = input;
      const result = calculatePower(a, b);
      console.log(`Power calculation: ${a} x ${b} = ${result}`);
      return `${a} raised to the power of ${b} is ${result}`;
    },
    {
      name: "power",
      description: "Raise a base number to an exponet",
      schema: z.object({
        a: z.number().describe("Base number"),
        b: z.number().describe("Exponent"),
      }),
    }
  ),

  tool(
    async (input: any) => {
      const { a, b } = input;
      const result = calculateProduct(a, b);
      console.log(`Multiply calculation: ${a} x ${b} = ${result}`);
      return `The product of ${a} and ${b} is ${result}`;
    },
    {
      name: "multiply",
      description: "Multiply two numbers",
      schema: z.object({
        a: z.number().describe("First number"),
        b: z.number().describe("Second number"),
      }),
    }
  ),

  tool(
    async (input: any) => {
      const { a, b } = input;
      const result = calculateDivision(a, b);
      console.log(`Division calculation: ${a} x ${b} = ${result}`);
      return `${a} divided by ${b} is ${result}`;
    },
    {
      name: "divide",
      description: "Divide first number by second numbers",
      schema: z.object({
        a: z.number().describe("Divident ( number to be divided)"),
        b: z.number().describe("Divisor ( number to dived by)"),
      }),
    }
  ),
];
