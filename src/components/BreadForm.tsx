import { Add, Delete } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { Field, FieldArray, Form, Formik, useFormikContext } from "formik";
import { Checkbox, TextField } from "formik-mui";
import debounce from "just-debounce-it";
import { useCallback, useEffect } from "react";
import { array, boolean, number, object, ObjectSchema, string } from "yup";

import initialData from "../initialData";
import { Bread } from "../types";

const AutoSave = () => {
  const debounceMs = 100;
  const formik = useFormikContext();
  const debouncedSubmit = useCallback(
    debounce(() => formik.submitForm(), debounceMs),
    [debounceMs, formik.submitForm],
  );

  useEffect(() => {
    debouncedSubmit();
  }, [debouncedSubmit, formik.values]);

  return <></>;
};

interface BreadFormProps {
  onChange: (bread: Bread) => void;
}

export default function BreadForm({ onChange }: BreadFormProps) {
  const validationSchema: ObjectSchema<Bread> = object({
    totalWeight: number().required().min(0, "Must not be negative"),
    hydration: number().required().min(0),
    starterPerc: number().required().min(0),
    saltPerc: number().required().min(0),
    useProteinTarget: boolean().required(),
    proteinTarget: object({
      target: number().required(),
      gluten: number().required(),
    }).required(),
    starter: object({
      name: string().required(),
      hydration: number().required(),
      protein: number().required(),
    }),
    mainFlour: object({
      name: string().required(),
      protein: number().required(),
    }),
    flours: array(
      object({
        name: string().required(),
        protein: number().required(),
        amount: number().required().min(0),
      }),
    )
      .required()
      .test(
        "uniqueName",
        "Flour names must be unique",
        (val) => val.length == new Set(val.map((v) => v.name)).size,
      ),
  });
  return (
    <Formik
      initialValues={initialData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        onChange(values);
        setSubmitting(false);
      }}
    >
      {({ values, isValid, errors }) => (
        <Form>
          <AutoSave />
          <Box margin={1}>
            <Field
              component={TextField}
              fullWidth
              type="number" // TODO check if this is correct (see why MUI has no number input)
              name="totalWeight"
              label="Total weight"
            />
          </Box>
          <Box margin={1}>
            <Field
              component={TextField}
              fullWidth
              type="number"
              name="hydration"
              label="Hydration"
            />
          </Box>
          <Box margin={1}>
            <Field
              component={TextField}
              fullWidth
              type="number"
              name="starterPerc"
              label="Starter Percentage"
            />
          </Box>
          <Box margin={1}>
            <Field
              component={TextField}
              fullWidth
              type="number"
              name="saltPerc"
              label="Salt Percentage"
            />
          </Box>
          <Box margin={1}>
            <FormControlLabel
              control={
                <Field
                  component={Checkbox}
                  type="checkbox"
                  name="useProteinTarget"
                />
              }
              label="Use Gluten"
            />
          </Box>
          {values.useProteinTarget ? (
            <>
              <Box margin={1}>
                <Field
                  component={TextField}
                  fullWidth
                  type="number"
                  name="proteinTarget.target"
                  label="Taget Protein"
                />
              </Box>
              <Box margin={1}>
                <Field
                  component={TextField}
                  fullWidth
                  type="number"
                  name="proteinTarget.gluten"
                  label="Gluten Protein"
                />
              </Box>
            </>
          ) : (
            <></>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Starter - {values.starter.name}
          </Typography>
          <Box margin={1}>
            <Field
              component={TextField}
              fullWidth
              type="string"
              name="starter.name"
              label="Starter Name"
            />
          </Box>
          <Box margin={1}>
            <Field
              component={TextField}
              fullWidth
              type="number"
              name="starter.hydration"
              label="Starter Hydration"
            />
          </Box>
          {values.useProteinTarget ? (
            <>
              <Box margin={1}>
                <Field
                  component={TextField}
                  fullWidth
                  type="number"
                  name="starter.protein"
                  label="Starter Protein"
                />
              </Box>
            </>
          ) : (
            <></>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Main Flour - {values.mainFlour.name}
          </Typography>
          <Box margin={1}>
            <Field
              component={TextField}
              fullWidth
              type="string"
              name="mainFlour.name"
              label="Main Flour Name"
            />
          </Box>
          {values.useProteinTarget ? (
            <>
              <Box margin={1}>
                <Field
                  component={TextField}
                  fullWidth
                  type="number"
                  name="mainFlour.protein"
                  label="Main Flour Protein"
                />
              </Box>
            </>
          ) : (
            <></>
          )}
          <FieldArray name="flours">
            {({ remove, push }) => (
              // TODO do I need this div?
              <div>
                {values.flours.length > 0 &&
                  values.flours.map((flour, index) => (
                    <div key={index}>
                      <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                      >
                        Flour - {flour.name}
                      </Typography>
                      <Box margin={1}>
                        <Field
                          component={TextField}
                          fullWidth
                          type="string"
                          name={`flours.${index}.name`}
                          label="Flour Name"
                        />
                      </Box>
                      {values.useProteinTarget ? (
                        <>
                          <Box margin={1}>
                            <Field
                              component={TextField}
                              fullWidth
                              type="number"
                              name={`flours.${index}.protein`}
                              label="Flour Protein"
                            />
                          </Box>
                        </>
                      ) : (
                        <></>
                      )}
                      <Box margin={1}>
                        <Field
                          component={TextField}
                          fullWidth
                          type="number"
                          name={`flours.${index}.amount`}
                          label="Flour Amount"
                        />
                      </Box>
                      <Button
                        variant="contained"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => remove(index)}
                      >
                        Delete
                      </Button>
                    </div>
                  ))}
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() =>
                    push({
                      name: `flour ${values.flours.length + 1}`,
                      protein: 10,
                      amount: 20,
                    })
                  }
                >
                  Add Flour
                </Button>
              </div>
            )}
          </FieldArray>
          {!isValid ? (
            // TODO show the flour name error directly at the input field
            <Alert severity="error">
              The form is not valid
              {typeof errors.flours === "string" ? ` : ${errors.flours}.` : "."}
            </Alert>
          ) : (
            <></>
          )}
        </Form>
      )}
    </Formik>
  );
}
