import * as React from 'react';
import { HttpResponse } from '../../services/account.service'
import { AccountServiceContext } from '../../services/AccountServiceContext';
import { KeycloakContext } from '../../services/KeycloakContext';
import { KeycloakService } from '../../services/keycloak.service';
import { AIACommand } from '../../services/AIACommand';
import { Features } from '../../services/Features';
import { Msg } from '../../services/Msg';
import FormTextInputWithLabel from "@/components/elements/forms/inputs/text-input-with-label";

//declare const features: Features;
declare const locale: string;

interface AccountPageProps {
}

interface FormFields {
    readonly username?: string;
    readonly firstName?: string;
    readonly lastName?: string;
    readonly email?: string;
    attributes?: { locale?: [string] };
}

interface AccountPageState {
    readonly errors: FormFields;
    readonly formFields: FormFields;
}

export class AccountPage extends React.Component<AccountPageProps, AccountPageState> {
    static contextType = AccountServiceContext;
    context: React.ContextType<typeof AccountServiceContext>;
    private isRegistrationEmailAsUsername: boolean = true;//features.isRegistrationEmailAsUsername;
    private isEditUserNameAllowed: boolean = true;//features.isEditUserNameAllowed;
    private isDeleteAccountAllowed: boolean = true;//features.deleteAccountAllowed;
    private isUpdateEmailFeatureEnabled: boolean = true;//features.updateEmailFeatureEnabled;
    private isUpdateEmailActionEnabled: boolean = true;//features.updateEmailActionEnabled;
    private readonly DEFAULT_STATE: AccountPageState = {
        errors: {
            username: '',
            firstName: '',
            lastName: '',
            email: ''
        },
        formFields: {
            username: '',
            firstName: '',
            lastName: '',
            email: '',
            attributes: {}
        }
    };

    public state: AccountPageState = this.DEFAULT_STATE;

    public constructor(props: AccountPageProps, context: React.ContextType<typeof AccountServiceContext>) {
        super(props);
        this.context = context;

        this.fetchPersonalInfo();
    }

    private fetchPersonalInfo(): void {
        this.context!.doGet<FormFields>("/")
            .then((response: HttpResponse<FormFields>) => {
                this.setState(this.DEFAULT_STATE);
                const formFields = response.data;
                if (!formFields!.attributes) {
                    formFields!.attributes = { locale: [locale] };
                }
                else if (!formFields!.attributes.locale) {
                    formFields!.attributes.locale = [locale];
                }

                this.setState({...{ formFields: formFields as FormFields }});
            });
    }

    private handleCancel = (): void => {
        this.fetchPersonalInfo();
    }

    private handleChange = (value: string, event: React.FormEvent<HTMLInputElement>) => {
        const target = event.currentTarget;
        const name = target.name;

        this.setState({
            errors: { ...this.state.errors, [name]: target.validationMessage },
            formFields: { ...this.state.formFields, [name]: value }
        });
    }

    private handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const form = event.target as HTMLFormElement;
        const isValid = form.checkValidity();
        if (isValid) {
            const reqData: FormFields = { ...this.state.formFields };
            this.context!.doPost<void>("/", reqData)
                .then(() => {
                    alert('accountUpdatedMessage');
                    if (locale !== this.state.formFields.attributes!.locale![0]) {
                        window.location.reload();
                    }
                });
        } else {
            const formData = new FormData(form);
            const validationMessages = Array.from(formData.keys()).reduce((acc, key) => {
                acc[key] = form.elements[key].validationMessage
                return acc
            }, {});
            this.setState({
                errors: { ...validationMessages },
                formFields: this.state.formFields
            });
        }

    }

    private handleDelete = (keycloak: KeycloakService): void => {
        new AIACommand(keycloak, "delete_account").execute();
    }

    private handleEmailUpdate = (keycloak: KeycloakService): void => {
        new AIACommand(keycloak, "UPDATE_EMAIL").execute();
    }

    public render(): React.ReactNode {
        const fields: FormFields = this.state.formFields;
        return (
                    <section
          aria-labelledby="primary-heading"
          className="flex h-full min-w-0 flex-1 flex-col overflow-y-auto px-4"
        >
          {!this.isRegistrationEmailAsUsername && fields.username != undefined && (
          <FormTextInputWithLabel slug="user-name" label={Msg.localize("username")}></FormTextInputWithLabel>
          )}
          {!this.isUpdateEmailFeatureEnabled && fields.email != undefined && (
          <FormTextInputWithLabel slug="email-address" label={Msg.localize("email")}></FormTextInputWithLabel>
          )}
          <FormTextInputWithLabel slug="firstName" label="First Name"></FormTextInputWithLabel>  
          <FormTextInputWithLabel slug="lastName" label="Last Name"></FormTextInputWithLabel>  

           {/*} <ContentPage
                title="personalInfoHtmlTitle"
                introMessage="personalSubMessage"
            >
                <PageSection isFilled variant={PageSectionVariants.light}>
                    <TextContent className="pf-u-mb-lg">
                        <Text component={TextVariants.small}>
                          {Msg.localize('allFieldsRequired')}
                        </Text>
                    </TextContent>
                    <Form
                        onSubmit={(event) => this.handleSubmit(event)}
                        className="personal-info-form"
                    >
                        {!this.isRegistrationEmailAsUsername && fields.username != undefined && (
                            <FormGroup
                                label={Msg.localize("username")}
                                fieldId="user-name"
                                helperTextInvalid={this.state.errors.username}
                                validated={
                                    this.state.errors.username !== ""
                                        ? ValidatedOptions.error
                                        : ValidatedOptions.default
                                }
                            >
                                {this.isEditUserNameAllowed && <this.UsernameInput />}
                                {!this.isEditUserNameAllowed && (
                                    <this.RestrictedUsernameInput />
                                )}
                            </FormGroup>
                        )}
                        {!this.isUpdateEmailFeatureEnabled && fields.email != undefined && <FormGroup
                            label={Msg.localize('email')}
                            fieldId="email-address"
                            helperTextInvalid={this.state.errors.email}
                            validated={
                                this.state.errors.email !== ""
                                    ? ValidatedOptions.error
                                    : ValidatedOptions.default
                            }
                        >
                            <TextInput
                                isRequired
                                type="email"
                                id="email-address"
                                name="email"
                                maxLength={254}
                                value={fields.email}
                                onChange={this.handleChange}
                                validated={
                                    this.state.errors.email !== ""
                                        ? ValidatedOptions.error
                                        : ValidatedOptions.default
                                }
                            ></TextInput>
                        </FormGroup> }
                        {this.isUpdateEmailFeatureEnabled && <FormGroup
                            label={Msg.localize('email')}
                            fieldId="email-address"
                        >
                            <InputGroup>
                                <TextInput
                                    isDisabled
                                    type="email"
                                    id="email-address"
                                    name="email"
                                    value={fields.email}
                                >
                                </TextInput>
                                {this.isUpdateEmailActionEnabled && (!this.isRegistrationEmailAsUsername || this.isEditUserNameAllowed) &&
                                    <KeycloakContext.Consumer>
                                        { (keycloak: KeycloakService) => (
                                            <Button id="update-email-btn"
                                                    variant="link"
                                                    onClick={() => this.handleEmailUpdate(keycloak)}
                                                    icon={<ExternalLinkSquareAltIcon/>}
                                                    iconPosition="right">
                                                <Msg msgKey="updateEmail" />
                                            </Button>
                                        )}
                                    </KeycloakContext.Consumer>
                                }
                            </InputGroup>
                        </FormGroup> }
                        { fields.firstName != undefined && <FormGroup
                                label={Msg.localize("firstName")}
                                fieldId="first-name"
                                helperTextInvalid={this.state.errors.firstName}
                                validated={
                                    this.state.errors.firstName !== ""
                                        ? ValidatedOptions.error
                                        : ValidatedOptions.default
                                }
                            >
                                <TextInput
                                    isRequired
                                    type="text"
                                    id="first-name"
                                    name="firstName"
                                    maxLength={254}
                                    value={fields.firstName}
                                    onChange={this.handleChange}
                                    validated={
                                        this.state.errors.firstName !== ""
                                            ? ValidatedOptions.error
                                            : ValidatedOptions.default
                                    }
                                ></TextInput>
                            </FormGroup>
                        }
                        {fields.lastName != undefined && <FormGroup
                                label={Msg.localize("lastName")}
                                fieldId="last-name"
                                helperTextInvalid={this.state.errors.lastName}
                                validated={
                                    this.state.errors.lastName !== ""
                                        ? ValidatedOptions.error
                                        : ValidatedOptions.default
                                }
                            >
                                <TextInput
                                    isRequired
                                    type="text"
                                    id="last-name"
                                    name="lastName"
                                    maxLength={254}
                                    value={fields.lastName}
                                    onChange={this.handleChange}
                                    validated={
                                        this.state.errors.lastName !== ""
                                            ? ValidatedOptions.error
                                            : ValidatedOptions.default
                                    }
                                ></TextInput>
                            </FormGroup>
                        }
                        {features.isInternationalizationEnabled && (
                            <FormGroup
                                label={Msg.localize("selectLocale")}
                                isRequired
                                fieldId="locale"
                            >
                                <LocaleSelector
                                    id="locale-selector"
                                    value={fields.attributes!.locale || ""}
                                    onChange={(value) =>
                                        this.setState({
                                            errors: this.state.errors,
                                            formFields: {
                                                ...this.state.formFields,
                                                attributes: {
                                                    ...this.state.formFields.attributes,
                                                    locale: [value],
                                    },
                                    },
                                    })
                                    }
                                />
                            </FormGroup>
                        )}
                        <ActionGroup>
                            <Button
                                type="submit"
                                id="save-btn"
                                variant="primary"
                                isDisabled={
                                    Object.values(this.state.errors).filter((e) => e !== "")
                                    .length !== 0
                                }
                            >
                                <Msg msgKey="doSave" />
                            </Button>
                            <Button
                                id="cancel-btn"
                                variant="link"
                                onClick={this.handleCancel}
                            >
                                <Msg msgKey="doCancel" />
                            </Button>
                        </ActionGroup>
                    </Form>

            {this.isDeleteAccountAllowed && (
                <div id="delete-account" style={{ marginTop: "30px" }}>
                    <ExpandableSection toggleText={Msg.localize("deleteAccount")}>
                        <Grid hasGutter>
                            <GridItem span={6}>
                                <p>
                                    <Msg msgKey="deleteAccountWarning" />
                                </p>
                            </GridItem>
                            <GridItem span={4}>
                                <KeycloakContext.Consumer>
                                    {(keycloak: KeycloakService) => (
                                        <Button
                                            id="delete-account-btn"
                                            variant="danger"
                                            onClick={() => this.handleDelete(keycloak)}
                                            className="delete-button"
                                        >
                                            <Msg msgKey="doDelete" />
                                        </Button>
                                    )}
                                </KeycloakContext.Consumer>
                            </GridItem>
                            <GridItem span={2}></GridItem>
                        </Grid>
                    </ExpandableSection>
                </div>
            )}
            </PageSection>
                                    </ContentPage> */}
                        </section>
        );
    }

    /*
    private UsernameInput = () => (
        <TextInput
            isRequired
            type="text"
            id="user-name"
            name="username"
            maxLength={254}
            value={this.state.formFields.username}
            onChange={this.handleChange}
            validated={this.state.errors.username !== '' ? ValidatedOptions.error : ValidatedOptions.default}
            >
        </TextInput>
    );

    private RestrictedUsernameInput = () => (
        <TextInput
            isReadOnly
            type="text"
            id="user-name"
            name="username"
            value={this.state.formFields.username}
        >
        </TextInput>
    );
    */
};

