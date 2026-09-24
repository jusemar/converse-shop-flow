import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CircleUserRound,
  Clock3,
  Image as ImageIcon,
  MapPin,
  Menu,
  MessageCircle,
  Minus,
  MoreVertical,
  Paperclip,
  Phone,
  Plus,
  Search,
  Send,
  ShoppingBag,
  ShoppingBasket,
  Store,
  Trash2,
  Video,
} from "lucide-react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputButton,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import pratoMineiro from "@/assets/prato-mineiro.jpg";
import frangoGrelhado from "@/assets/frango-grelhado.jpg";
import boloChocolate from "@/assets/bolo-chocolate.jpg";
import limonadaRosa from "@/assets/limonada-rosa.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jaa — Atendimento e pedidos" },
      {
        name: "description",
        content: "Converse com clientes e monte pedidos sem sair do atendimento.",
      },
      { property: "og:title", content: "Jaa — Atendimento e pedidos" },
      {
        property: "og:description",
        content: "Converse com clientes e monte pedidos sem sair do atendimento.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type View = "chat" | "store" | "order" | "conversations";

type Product = {
  id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
};

const conversations = [
  {
    initials: "SM",
    name: "Sabor Mineiro",
    type: "Restaurante",
    text: "Monte seu prato do seu jeito!",
    time: "11:24",
    unread: 2,
    active: true,
  },
  {
    initials: "PB",
    name: "Pizzaria do Bairro",
    type: "Pizzaria",
    text: "Seu pedido está a caminho!",
    time: "10:50",
    unread: 0,
  },
  {
    initials: "PF",
    name: "Pet Feliz",
    type: "Pet shop",
    text: "Ração em promoção hoje!",
    time: "Ontem",
    unread: 0,
  },
  {
    initials: "S+",
    name: "Farmácia Saúde+",
    type: "Farmácia",
    text: "Medicamento disponível!",
    time: "Ontem",
    unread: 0,
  },
  {
    initials: "ME",
    name: "Mercado Express",
    type: "Supermercado",
    text: "Ofertas da semana",
    time: "Seg",
    unread: 0,
  },
  {
    initials: "ER",
    name: "Entrega Rápida",
    type: "Entregador",
    text: "Estou a caminho!",
    time: "Seg",
    unread: 0,
  },
];

const products: Product[] = [
  {
    id: "mineiro",
    category: "Pratos",
    name: "Prato Mineiro",
    description: "Arroz, feijão, bife e legumes salteados",
    price: 29.9,
    image: pratoMineiro,
    badge: "Mais pedido",
  },
  {
    id: "frango",
    category: "Pratos",
    name: "Frango Grelhado",
    description: "Frango, batatas douradas e salada fresca",
    price: 27.9,
    image: frangoGrelhado,
  },
  {
    id: "limonada",
    category: "Bebidas",
    name: "Limonada Rosa",
    description: "Garrafa 350 ml, bem gelada",
    price: 7.5,
    image: limonadaRosa,
  },
  {
    id: "bolo",
    category: "Sobremesas",
    name: "Bolo de Brigadeiro",
    description: "Chocolate intenso e cobertura cremosa",
    price: 12.9,
    image: boloChocolate,
  },
];

function Brand() {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-sm">
        <MessageCircle className="size-5" strokeWidth={2.5} />
      </span>
      <span className="font-display text-xl font-bold text-foreground">Jaa</span>
    </div>
  );
}

function Index() {
  const [view, setView] = useState<View>("chat");
  const [category, setCategory] = useState("Todos");
  const [cart, setCart] = useState<Record<string, number>>({ mineiro: 1 });
  const [messages, setMessages] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  const cartItems = products.filter((product) => (cart[product.id] ?? 0) > 0);
  const subtotal = cartItems.reduce(
    (sum, product) => sum + product.price * (cart[product.id] ?? 0),
    0,
  );
  const totalCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  const filteredProducts =
    category === "Todos" ? products : products.filter((product) => product.category === category);
  const filteredConversations = conversations.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  const setQuantity = (id: string, next: number) => {
    setCart((current) => ({ ...current, [id]: Math.max(0, next) }));
  };

  const mobileTitle = useMemo(() => {
    if (view === "store") return "Cardápio";
    if (view === "order") return "Seu pedido";
    return "Sabor Mineiro";
  }, [view]);

  return (
    <TooltipProvider>
      <main className="h-dvh min-h-[640px] overflow-hidden bg-background text-foreground">
        <div className="mx-auto grid h-full max-w-[1600px] grid-cols-1 border-x border-border bg-card shadow-sm lg:grid-cols-[300px_minmax(430px,1fr)_330px]">
          <aside
            className={cn(
              "min-h-0 border-r border-border bg-card",
              view === "conversations" ? "flex" : "hidden",
              "lg:flex lg:flex-col",
            )}
          >
            <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-border px-5">
              <Brand />
              <Button
                aria-label="Novo atendimento"
                title="Novo atendimento"
                size="icon"
                variant="ghost"
              >
                <Plus />
              </Button>
            </div>
            <div className="border-b border-border p-4">
              <label className="flex h-10 items-center gap-2 rounded-md bg-muted px-3 text-muted-foreground focus-within:ring-2 focus-within:ring-ring/30">
                <Search className="size-4 shrink-0" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                  placeholder="Buscar conversas"
                />
              </label>
              <div className="mt-3 flex gap-2">
                <Button size="sm" className="rounded-full shadow-none">
                  Todas
                </Button>
                <Button size="sm" variant="ghost" className="rounded-full text-muted-foreground">
                  Não lidas{" "}
                  <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
                    3
                  </span>
                </Button>
              </div>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto py-2">
              {filteredConversations.map((item, index) => (
                <button
                  key={item.name}
                  onClick={() => setView("chat")}
                  className={cn(
                    "relative grid w-full grid-cols-[44px_minmax(0,1fr)_auto] gap-3 px-4 py-3 text-left transition-colors hover:bg-muted",
                    item.active && "bg-muted",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-11 place-items-center rounded-full text-xs font-bold",
                      index % 3 === 0
                        ? "bg-primary text-primary-foreground"
                        : index % 3 === 1
                          ? "bg-foreground text-background"
                          : "bg-accent text-accent-foreground",
                    )}
                  >
                    {item.initials}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">{item.name}</span>
                    <span className="block truncate text-xs font-medium text-muted-foreground">
                      {item.type}
                    </span>
                    <span className="mt-1 block truncate text-xs text-muted-foreground">
                      {item.text}
                    </span>
                  </span>
                  <span className="flex flex-col items-end gap-2 text-[11px] text-muted-foreground">
                    {item.time}
                    {item.unread > 0 && (
                      <span className="grid size-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {item.unread}
                      </span>
                    )}
                  </span>
                </button>
              ))}
            </div>
            <div className="grid h-16 shrink-0 grid-cols-3 border-t border-border px-3">
              <button className="flex flex-col items-center justify-center gap-1 text-[10px] font-bold text-primary">
                <MessageCircle className="size-5" />
                Conversas
              </button>
              <button className="flex flex-col items-center justify-center gap-1 text-[10px] text-muted-foreground">
                <ShoppingBag className="size-5" />
                Pedidos
              </button>
              <button className="flex flex-col items-center justify-center gap-1 text-[10px] text-muted-foreground">
                <CircleUserRound className="size-5" />
                Perfil
              </button>
            </div>
          </aside>

          <section
            className={cn(
              "min-h-0 min-w-0 bg-background",
              view === "conversations" || view === "order" ? "hidden" : "flex flex-col",
              "lg:flex",
            )}
          >
            <header className="grid h-[72px] shrink-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-muted px-4 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <Button
                  onClick={() => setView("conversations")}
                  aria-label="Ver conversas"
                  title="Ver conversas"
                  size="icon"
                  variant="ghost"
                  className="shrink-0 lg:hidden"
                >
                  <ArrowLeft />
                </Button>
                <span className="grid size-10 shrink-0 place-items-center rounded-full bg-primary font-display text-sm font-bold text-primary-foreground">
                  SM
                </span>
                <div className="min-w-0">
                  <h1 className="truncate font-display text-sm font-bold sm:text-base">
                    {mobileTitle}
                  </h1>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <span className="size-1.5 rounded-full bg-primary" /> Online agora
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  onClick={() => setView(view === "store" ? "chat" : "store")}
                  aria-label={view === "store" ? "Voltar à conversa" : "Ver cardápio"}
                  variant={view === "store" ? "default" : "secondary"}
                  className="gap-2 px-3 shadow-none"
                >
                  {view === "store" ? <MessageCircle /> : <Store />}
                  <span className="hidden sm:inline">
                    {view === "store" ? "Voltar à conversa" : "Ver cardápio"}
                  </span>
                </Button>
                <Button
                  aria-label="Chamada"
                  title="Chamada"
                  size="icon"
                  variant="ghost"
                  className="hidden sm:inline-flex"
                >
                  <Phone />
                </Button>
                <Button aria-label="Mais opções" title="Mais opções" size="icon" variant="ghost">
                  <MoreVertical />
                </Button>
              </div>
            </header>

            {view === "store" ? (
              <StoreView
                category={category}
                setCategory={setCategory}
                products={filteredProducts}
                cart={cart}
                setQuantity={setQuantity}
                onOrder={() => setView("order")}
                totalCount={totalCount}
              />
            ) : (
              <ChatView
                messages={messages}
                onSend={(text) => setMessages((current) => [...current, text])}
              />
            )}
          </section>

          <OrderPanel
            className={cn(view === "order" ? "flex" : "hidden", "lg:flex")}
            cart={cart}
            cartItems={cartItems}
            subtotal={subtotal}
            setQuantity={setQuantity}
            onBack={() => setView("chat")}
          />
        </div>
      </main>
    </TooltipProvider>
  );
}

function ChatView({
  messages,
  onSend,
}: {
  messages: string[];
  onSend: (text: string) => void;
}) {
  return (
    <div className="chat-wallpaper flex min-h-0 flex-1 flex-col">
      <Conversation>
        <ConversationContent className="mx-auto w-full max-w-3xl gap-3 px-4 py-6 sm:px-8">
          <div className="mx-auto rounded-full bg-card px-3 py-1 text-[11px] font-semibold text-muted-foreground shadow-sm">
            Hoje
          </div>
          <Message from="assistant" className="max-w-[86%] sm:max-w-[72%]">
            <MessageContent className="rounded-md bg-card px-4 py-3 shadow-sm">
              <MessageResponse>
                Olá! Que bom ter você por aqui. Posso ajudar com o cardápio ou montar seu pedido.
              </MessageResponse>
              <span className="self-end text-[10px] text-muted-foreground">11:22</span>
            </MessageContent>
          </Message>
          <Message from="user" className="max-w-[86%] sm:max-w-[72%]">
            <MessageContent className="bg-secondary px-4 py-3 text-secondary-foreground shadow-sm">
              <MessageResponse>Quero ver as opções de almoço de hoje.</MessageResponse>
              <span className="flex items-center gap-1 self-end text-[10px] text-primary">
                11:23 <Check className="size-3" />
              </span>
            </MessageContent>
          </Message>
          <Message from="assistant" className="max-w-[90%] sm:max-w-[76%]">
            <MessageContent className="rounded-md bg-card px-4 py-3 shadow-sm">
              <MessageResponse>
                Perfeito! Nosso cardápio está aberto. Você pode escolher os itens sem sair desta
                conversa.
              </MessageResponse>
              <span className="self-end text-[10px] text-muted-foreground">11:24</span>
            </MessageContent>
          </Message>
          {messages.map((message, index) => (
            <Message from="user" key={`${message}-${index}`} className="max-w-[86%] sm:max-w-[72%]">
              <MessageContent className="bg-secondary px-4 py-3 text-secondary-foreground shadow-sm">
                <MessageResponse>{message}</MessageResponse>
                <span className="flex items-center gap-1 self-end text-[10px] text-primary">
                  Agora <Check className="size-3" />
                </span>
              </MessageContent>
            </Message>
          ))}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="shrink-0 border-t border-border bg-muted p-3 sm:p-4">
        <PromptInput
          onSubmit={({ text }) => {
            if (text.trim()) onSend(text.trim());
          }}
          className="mx-auto max-w-3xl rounded-lg border-transparent bg-card shadow-sm"
        >
          <PromptInputTextarea placeholder="Digite uma mensagem..." className="min-h-12 px-4" />
          <PromptInputFooter className="px-2 pb-2">
            <PromptInputTools>
              <PromptInputButton tooltip="Anexar arquivo">
                <Paperclip />
              </PromptInputButton>
              <PromptInputButton tooltip="Enviar imagem">
                <ImageIcon />
              </PromptInputButton>
            </PromptInputTools>
            <PromptInputSubmit aria-label="Enviar mensagem">
              <Send />
            </PromptInputSubmit>
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}

function StoreView({
  cart,
  setQuantity,
  onOrder,
  totalCount,
}: {
  category: string;
  setCategory: (value: string) => void;
  products: Product[];
  cart: Record<string, number>;
  setQuantity: (id: string, next: number) => void;
  onOrder: () => void;
  totalCount: number;
}) {
  const [size, setSize] = useState<"small" | "large">("large");
  const [protein, setProtein] = useState("Bife bovino");
  const [sides, setSides] = useState(["Arroz branco", "Feijão", "Salada", "Legumes salteados"]);
  const sideOptions: Array<[string, string]> = [
    ["Arroz branco", "arroz"],
    ["Farofa", "farofa"],
    ["Feijão", "feijao"],
    ["Salada", "salada"],
    ["Batata frita", "batata"],
    ["Vinagrete", "vinagrete"],
    ["Purê de batata", "pure"],
    ["Macarrão", "macarrao"],
    ["Legumes salteados", "legumes"],
    ["Couve refogada", "couve"],
  ];
  const proteinOptions = ["Bife bovino", "Frango grelhado", "Linguiça", "Carne de panela", "Peixe"];
  const categories = [
    ["🍛", "Pratos prontos"],
    ["🥤", "Refrigerantes"],
    ["🍰", "Sobremesas"],
    ["🍟", "Porções"],
    ["•••", "Outros"],
  ];

  const toggleSide = (name: string) => {
    setSides((current) => {
      if (current.includes(name)) return current.filter((item) => item !== name);
      if (current.length >= 5) return current;
      return [...current, name];
    });
  };

  return (
    <div className="panel-in chat-wallpaper min-h-0 flex-1 overflow-y-auto">
      <div className="mx-auto max-w-4xl space-y-2.5 px-3 py-3 sm:px-5 sm:py-4">
        <section className="rounded-lg border border-border bg-card p-3 shadow-sm sm:p-4">
          <h2 className="text-sm font-bold">1. Escolha o tamanho do prato</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {[
              { id: "small" as const, label: "Pequeno", price: "R$ 24,90" },
              { id: "large" as const, label: "Grande", price: "R$ 29,90" },
            ].map((option) => (
              <button
                key={option.id}
                onClick={() => setSize(option.id)}
                className={cn(
                  "grid min-h-16 grid-cols-[22px_48px_1fr] items-center gap-3 rounded-md border px-3 text-left transition-colors",
                  size === option.id ? "border-primary bg-secondary/40" : "border-border bg-card",
                )}
              >
                <span className={cn("grid size-4 place-items-center rounded-full border", size === option.id ? "border-primary" : "border-input")}>
                  {size === option.id && <span className="size-2 rounded-full bg-primary" />}
                </span>
                <img src={pratoMineiro} alt="" className="size-11 rounded-full object-cover" />
                <span>
                  <span className="block text-xs font-bold">{option.label}</span>
                  <span className="mt-0.5 block text-sm font-bold text-primary">{option.price}</span>
                </span>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-3 shadow-sm sm:p-4">
          <h2 className="text-sm font-bold">2. Escolha suas guarnições <span className="font-normal text-muted-foreground">(até 5)</span></h2>
          <p className="mt-1 text-[11px] text-muted-foreground">As guarnições são as mesmas para os dois tamanhos.</p>
          <div className="mt-3 grid grid-cols-2 gap-x-5 sm:gap-x-10">
            {sideOptions.map(([name, imageKey]) => {
              const selected = sides.includes(name);
              return (
                <button
                  key={name}
                  onClick={() => toggleSide(name)}
                  className="grid min-h-11 grid-cols-[18px_34px_minmax(0,1fr)] items-center gap-2 border-b border-border/50 text-left last:border-0"
                >
                  <span className={cn("grid size-4 place-items-center rounded-[3px] border", selected ? "border-primary bg-primary text-primary-foreground" : "border-input bg-card")}>
                    {selected && <Check className="size-3" strokeWidth={3} />}
                  </span>
                  <span className="grid size-8 place-items-center rounded-full bg-muted text-base" aria-hidden="true">
                    {imageKey === "arroz" ? "🍚" : imageKey === "farofa" ? "🥣" : imageKey === "feijao" ? "🫘" : imageKey === "salada" ? "🥗" : imageKey === "batata" ? "🍟" : imageKey === "vinagrete" ? "🍅" : imageKey === "pure" ? "🥔" : imageKey === "macarrao" ? "🍝" : imageKey === "legumes" ? "🥘" : "🥬"}
                  </span>
                  <span className="truncate text-[11px] sm:text-xs">{name}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-3 shadow-sm sm:p-4">
          <h2 className="text-sm font-bold">3. Escolha o tipo de carne <span className="font-normal text-muted-foreground">(apenas 1)</span></h2>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
            {proteinOptions.map((name, index) => (
              <button
                key={name}
                onClick={() => setProtein(name)}
                className={cn(
                  "relative flex min-h-24 flex-col items-center justify-center rounded-md border p-2 text-center transition-colors",
                  protein === name ? "border-primary bg-secondary/40" : "border-border bg-card",
                )}
              >
                <span className={cn("absolute left-2 top-2 grid size-3.5 place-items-center rounded-full border", protein === name ? "border-primary" : "border-input")}>
                  {protein === name && <span className="size-2 rounded-full bg-primary" />}
                </span>
                <span className="text-3xl" aria-hidden="true">{index === 0 ? "🥩" : index === 1 ? "🍗" : index === 2 ? "🌭" : index === 3 ? "🍖" : "🐟"}</span>
                <span className="mt-1 text-[10px] font-medium leading-tight">{name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="grid gap-3 rounded-lg border border-border bg-card p-3 shadow-sm sm:grid-cols-[88px_minmax(0,1fr)_auto] sm:items-center">
          <img src={pratoMineiro} alt="Prato escolhido" className="h-20 w-full rounded-md object-cover sm:size-20" />
          <div className="min-w-0">
            <p className="text-xs font-bold">Seu prato ({size === "large" ? "Grande" : "Pequeno"})</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{protein}</p>
            <p className="line-clamp-2 text-[10px] leading-4 text-muted-foreground">{sides.join(", ")}</p>
            <p className="mt-1 text-xs font-bold text-primary">{size === "large" ? "R$ 29,90" : "R$ 24,90"}</p>
          </div>
          <div className="flex items-center justify-between gap-2 sm:justify-end">
            <div className="flex h-10 items-center rounded-md border border-border bg-card">
              <Button onClick={() => setQuantity("mineiro", (cart["mineiro"] ?? 0) - 1)} size="icon-sm" variant="ghost" aria-label="Diminuir quantidade"><Minus /></Button>
              <span className="w-7 text-center text-sm font-bold">{cart["mineiro"] ?? 0}</span>
              <Button onClick={() => setQuantity("mineiro", (cart["mineiro"] ?? 0) + 1)} size="icon-sm" variant="ghost" aria-label="Aumentar quantidade"><Plus /></Button>
            </div>
            <Button onClick={() => setQuantity("mineiro", Math.max(1, cart["mineiro"] ?? 0))} className="h-10 gap-2 px-4 shadow-none">
              <ShoppingBasket className="size-4" /> Adicionar ao pedido
            </Button>
          </div>
        </section>

        <div>
          <p className="mb-2 px-1 text-[11px] font-medium">Deseja adicionar mais itens? Escolha uma categoria abaixo:</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {categories.map(([icon, label]) => (
              <Button key={label} variant="outline" size="sm" className="justify-start gap-2 bg-card text-[10px] shadow-sm sm:justify-center">
                <span aria-hidden="true">{icon}</span> {label}
              </Button>
            ))}
          </div>
        </div>
      </div>
      {totalCount > 0 && (
        <div className="sticky bottom-0 border-t border-border bg-card/95 p-3 backdrop-blur lg:hidden">
          <Button onClick={onOrder} className="h-12 w-full justify-between px-4 text-base">
            <span className="flex items-center gap-2">
              <ShoppingBasket /> Ver pedido
            </span>
            <span className="rounded bg-primary-foreground/15 px-2 py-1 text-xs">
              {totalCount} {totalCount === 1 ? "item" : "itens"}
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}

function OrderPanel({
  className,
  cart,
  cartItems,
  subtotal,
  setQuantity,
  onBack,
}: {
  className?: string;
  cart: Record<string, number>;
  cartItems: Product[];
  subtotal: number;
  setQuantity: (id: string, next: number) => void;
  onBack: () => void;
}) {
  const delivery = subtotal > 0 ? 5 : 0;
  return (
    <aside className={cn("panel-in min-h-0 flex-col border-l border-border bg-card", className)}>
      <div className="grid h-[72px] shrink-0 grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 border-b border-border px-4">
        <Button
          onClick={onBack}
          aria-label="Voltar"
          title="Voltar"
          size="icon"
          variant="ghost"
          className="lg:hidden"
        >
          <ArrowLeft />
        </Button>
        <div className="flex min-w-0 items-center gap-2">
          <ShoppingBasket className="size-5 shrink-0 text-primary" />
          <h2 className="truncate font-display text-base font-bold">Seu pedido</h2>
        </div>
        <Button aria-label="Recolher pedido" title="Recolher pedido" size="icon" variant="ghost">
          <ChevronDown />
        </Button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold">Entrega</span>
            <span className="text-xs text-muted-foreground">25–40 min</span>
          </div>
          <div className="mt-3 flex gap-3 rounded-md bg-secondary p-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-xs font-bold">Rua das Flores, 123</p>
              <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                Centro · Belo Horizonte
              </p>
            </div>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold">Itens</h3>
            {cartItems.length > 0 && (
              <button
                onClick={() => cartItems.forEach((item) => setQuantity(item.id, 0))}
                className="text-xs font-semibold text-primary"
              >
                Limpar
              </button>
            )}
          </div>
          {cartItems.length === 0 ? (
            <div className="py-12 text-center">
              <ShoppingBag className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-bold">Seu pedido está vazio</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Abra a loja e escolha seus itens.
              </p>
            </div>
          ) : (
            cartItems.map((product) => {
              const quantity = cart[product.id] ?? 0;
              return (
                <div
                  key={product.id}
                  className="grid grid-cols-[56px_minmax(0,1fr)_auto] gap-3 border-b border-border py-3"
                >
                  <img
                    src={product.image}
                    alt=""
                    width={1024}
                    height={768}
                    loading="lazy"
                    className="size-14 rounded-md object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate text-xs font-bold">{product.name}</p>
                    <p className="mt-1 text-xs font-bold text-primary">
                      R$ {(product.price * quantity).toFixed(2).replace(".", ",")}
                    </p>
                    <div className="mt-2 flex w-fit items-center rounded-md border border-border">
                      <Button
                        onClick={() => setQuantity(product.id, quantity - 1)}
                        size="icon-sm"
                        variant="ghost"
                      >
                        <Minus />
                      </Button>
                      <span className="w-6 text-center text-xs font-bold">{quantity}</span>
                      <Button
                        onClick={() => setQuantity(product.id, quantity + 1)}
                        size="icon-sm"
                        variant="ghost"
                      >
                        <Plus />
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={() => setQuantity(product.id, 0)}
                    aria-label={`Remover ${product.name}`}
                    size="icon-sm"
                    variant="ghost"
                  >
                    <Trash2 />
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="shrink-0 border-t border-border p-4">
        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>R$ {subtotal.toFixed(2).replace(".", ",")}</span>
          </div>
          <div className="flex justify-between">
            <span>Entrega</span>
            <span>R$ {delivery.toFixed(2).replace(".", ",")}</span>
          </div>
        </div>
        <div className="my-4 flex items-center justify-between">
          <span className="font-display font-bold">Total</span>
          <span className="font-display text-xl font-bold text-primary">
            R$ {(subtotal + delivery).toFixed(2).replace(".", ",")}
          </span>
        </div>
        <Button
          disabled={subtotal === 0}
          onClick={() => alert("Protótipo visual: pedido pronto para pagamento.")}
          className="h-12 w-full gap-2 text-sm"
        >
          Ir para o pagamento <Send />
        </Button>
      </div>
    </aside>
  );
}
