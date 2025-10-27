import { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { RichTextEditor } from '../../components/RichTextEditor';
import { Button } from '../../components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { useGetSettingByKey, useUpsertSetting } from '../../hooks/settings.hooks';
import { Loader2 } from 'lucide-react';

const CLAN_RULES_KEY = 'clan_rules';

export default function AdminRulesEditor() {
  const [rulesContent, setRulesContent] = useState<string>('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const { data: existingRules, isLoading } = useGetSettingByKey(CLAN_RULES_KEY);
  const upsertMutation = useUpsertSetting();

  useEffect(() => {
    if (existingRules?.value) {
      setRulesContent(existingRules.value);
    }
  }, [existingRules]);

  const handleSave = async () => {
    if (!rulesContent.trim()) {
      alert('Por favor, adicione conteúdo às regras');
      return;
    }

    await upsertMutation.mutateAsync({
      key: CLAN_RULES_KEY,
      value: rulesContent,
    });
  };

  const handleReset = () => {
    if (existingRules?.value) {
      setRulesContent(existingRules.value);
    } else {
      setRulesContent('');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Gerenciador de Regras do Clã</h1>
          <p className="text-muted-foreground">
            Crie e edite as regras do clã que serão exibidas para todos os jogadores
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Editor de Regras</CardTitle>
                <CardDescription>
                  Use o editor abaixo para formatar as regras do clã
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isPreviewMode ? (
                  <RichTextEditor
                    value={rulesContent}
                    onChange={setRulesContent}
                    placeholder="Digite as regras do clã aqui..."
                  />
                ) : (
                  <div className="border rounded-lg p-4 min-h-96 bg-card">
                    <div
                      className="prose prose-sm dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: rulesContent }}
                    />
                  </div>
                )}

                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsPreviewMode(!isPreviewMode)}
                  >
                    {isPreviewMode ? 'Editar' : 'Visualizar'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    disabled={upsertMutation.isPending}
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleSave}
                    disabled={upsertMutation.isPending}
                  >
                    {upsertMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Salvando...
                      </>
                    ) : (
                      'Salvar Regras'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h4 className="font-semibold mb-2">Status</h4>
                  <p className="text-muted-foreground">
                    {existingRules
                      ? 'Regras já foram criadas'
                      : 'Nenhuma regra criada ainda'}
                  </p>
                </div>

                {existingRules && (
                  <>
                    <div>
                      <h4 className="font-semibold mb-2">Última atualização</h4>
                      <p className="text-muted-foreground">
                        {new Date(existingRules.updatedAt).toLocaleString('pt-BR')}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Criado em</h4>
                      <p className="text-muted-foreground">
                        {new Date(existingRules.createdAt).toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </>
                )}

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Dicas</h4>
                  <ul className="space-y-2 text-muted-foreground text-xs">
                    <li>• Use títulos para organizar as seções</li>
                    <li>• Crie listas para melhor legibilidade</li>
                    <li>• Adicione links para referências externas</li>
                    <li>• Use negrito e itálico para destacar</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}

