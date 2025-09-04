import { RadioGroup, Radio } from "@heroui/react";
export default function Language({
  language,
  setLanguage,
  isDisabled,
}: {
  language: string;
  setLanguage: (lang: string) => void;
  isDisabled: boolean;
}) {
  return (
    <RadioGroup
      isDisabled={isDisabled}
      label={language === "es" ? `Selecciona tu idioma` : `Select your language`}
      // label="Select your language"
      orientation="horizontal"
      defaultValue="en"
      className="space-x-4 text-white"
      value={language}
      onValueChange={setLanguage}
      classNames={{
        label: "text-white",
      }}
    >
      <Radio
        value="en"
        size="sm"
        classNames={{
          label: "text-white",
        }}
      >
        English
      </Radio>
      <Radio
        size="sm"
        value="es"
        classNames={{
          label: "text-white",
        }}
      >
        Español
      </Radio>
      {/* <Radio value="zh">Mandarin</Radio> */}
    </RadioGroup>
  );
}
