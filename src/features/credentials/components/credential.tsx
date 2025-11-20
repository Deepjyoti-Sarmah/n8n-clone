"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CredentialType } from "@/generated/prisma/enums";
import { useUpgradeModal } from "@/hooks/use-upgrade-model";
import {
  useCreateCredential,
  useUpdateCredential,
} from "../hooks/use-credentials";

interface CredentialFormProps {
  initalData?: {
    id?: string;
    name: string;
    type: CredentialType;
    value: string;
  };
}

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.enum(CredentialType),
  value: z.string().min(1, "API key is required"),
});

type FormValues = z.infer<typeof formSchema>;

const credentialTypeOptions = [
  {
    value: CredentialType.OPENAI,
    label: "OpenAI",
    logo: "/logos/openai.svg",
  },
  {
    value: CredentialType.ANTHROPIC,
    label: "Anthropic",
    logo: "/logos/anthropic.svg",
  },
  {
    value: CredentialType.GEMINI,
    label: "Gemini",
    logo: "/logos/gemini.svg",
  },
];

export const CredentialForm = ({ initalData }: CredentialFormProps) => {
  const router = useRouter();
  const createCredential = useCreateCredential();
  const updateCredential = useUpdateCredential();
  const { handleError, modal } = useUpgradeModal();

  const isEdit = !!initalData?.id;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initalData || {
      name: "",
      type: CredentialType.OPENAI,
      value: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    if (isEdit && initalData.id) {
      await updateCredential.mutateAsync({
        id: initalData.id,
        ...values,
      });
    } else {
      await createCredential.mutateAsync(values, {
        onError: (error) => {
          handleError(error);
        },
      });
    }
  };

  return (
    <>
      {modal}
      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>
            {isEdit ? "Edit Credential" : "Create Credential"}
          </CardTitle>
          <CardDescription>
            {isEdit
              ? "Update your API key or credential details"
              : "Add a new API or credential to your account"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My API key" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField />
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
};
